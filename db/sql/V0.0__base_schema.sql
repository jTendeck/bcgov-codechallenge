BEGIN TRANSACTION;

CREATE OR REPLACE FUNCTION update_changetimestamp_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP(3); 
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TABLE IF NOT EXISTS geo_api_usage_log (
    id                            SERIAL PRIMARY KEY,
    queried_longitude             DOUBLE PRECISION NOT NULL,
    queried_latitude              DOUBLE PRECISION NOT NULL,
    result_chsa_code              VARCHAR(4),
    result_chsa_name              VARCHAR(32),
    archived                      BOOLEAN NOT NULL DEFAULT false,
    created_at                    TIMESTAMP DEFAULT CURRENT_TIMESTAMP(3),
    updated_at                    TIMESTAMP DEFAULT CURRENT_TIMESTAMP(3)
    -- CHECK (queried_longitude)     BETWEEN -180.00 AND 180.00,
    -- CHECK (queried_latitude)      BETWEEN -90.00 AND 90.00  
);

DROP TRIGGER IF EXISTS update_geo_api_usage_log_changetimestamp on geo_api_usage_log;
CREATE TRIGGER update_geo_api_usage_log_changetimestamp BEFORE UPDATE
ON geo_api_usage_log FOR EACH ROW EXECUTE PROCEDURE 
update_changetimestamp_column();

END TRANSACTION;
