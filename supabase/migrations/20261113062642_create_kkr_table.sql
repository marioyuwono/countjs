CREATE TABLE public.kkr (
    s TEXT NOT NULL,
    v NUMERIC NOT NULL,
    t TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE VIEW public.kkr_summary AS
SELECT DISTINCT ON (s)
    s,
    v,
    t
FROM kkr
ORDER BY s, t DESC;

GRANT ALL PRIVILEGES ON TABLE public.kkr TO authenticated, service_role;
GRANT SELECT ON TABLE public.kkr_summary TO authenticated, service_role;
