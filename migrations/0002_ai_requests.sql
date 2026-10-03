-- Serialized reservations across instances. No model call runs before this succeeds.
create table if not exists ai_budget (
  scope text primary key, day date not null, calls integer not null default 0,
  reserved_cents integer not null default 0
);
create table if not exists ai_requests (
  scope text not null, cache_key text not null, owner text not null,
  expires_at timestamptz not null, result jsonb,
  primary key (scope, cache_key)
);
create table if not exists ai_clients (
  scope text not null, client_hash text not null, started_at timestamptz not null,
  calls integer not null, primary key(scope, client_hash)
);

create or replace function ai_claim(p_scope text, p_key text, p_client text, p_owner text,
  p_daily integer, p_budget integer, p_reserve integer)
returns jsonb language plpgsql as $$
declare
  budget ai_budget%rowtype;
  existing ai_requests%rowtype;
  browser ai_clients%rowtype;
  today date := (clock_timestamp() at time zone 'Asia/Seoul')::date;
begin
  if p_daily < 1 or p_budget < 1 or p_reserve < 1 then
    raise exception 'Invalid AI limits';
  end if;
  insert into ai_budget(scope,day) values(p_scope,today) on conflict do nothing;
  select * into budget from ai_budget where scope=p_scope for update;
  delete from ai_requests where scope=p_scope and expires_at <= clock_timestamp();
  delete from ai_clients where scope=p_scope and started_at < clock_timestamp()-interval '1 day';
  select * into existing from ai_requests where scope=p_scope and cache_key=p_key;
  if found then
    if existing.result is not null then
      return jsonb_build_object('status','cached','result',existing.result);
    end if;
    return jsonb_build_object('status','busy');
  end if;
  if budget.day <> today then
    update ai_budget set day=today,calls=0,reserved_cents=0 where scope=p_scope;
    budget.calls := 0; budget.reserved_cents := 0;
  end if;
  if budget.calls >= p_daily or budget.reserved_cents+p_reserve > p_budget then
    return jsonb_build_object('status','daily');
  end if;
  if (select count(*) from ai_requests where scope=p_scope and result is null) >= 2 then
    return jsonb_build_object('status','concurrency');
  end if;
  select * into browser from ai_clients where scope=p_scope and client_hash=p_client;
  if found and browser.started_at > clock_timestamp()-interval '10 minutes' and browser.calls >= 3 then
    return jsonb_build_object('status','client');
  end if;
  insert into ai_clients(scope,client_hash,started_at,calls) values(p_scope,p_client,clock_timestamp(),1)
  on conflict(scope,client_hash) do update set
    calls=case when ai_clients.started_at > clock_timestamp()-interval '10 minutes' then ai_clients.calls+1 else 1 end,
    started_at=case when ai_clients.started_at > clock_timestamp()-interval '10 minutes' then ai_clients.started_at else clock_timestamp() end;
  update ai_budget set calls=calls+1,reserved_cents=reserved_cents+p_reserve where scope=p_scope;
  insert into ai_requests(scope,cache_key,owner,expires_at) values(p_scope,p_key,p_owner,clock_timestamp()+interval '120 seconds');
  return jsonb_build_object('status','claimed');
end;
$$;
