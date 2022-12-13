-- Add code field.
ALTER TABLE "Game" ADD COLUMN     "code" TEXT;

-- Add code to existing games.
CREATE OR REPLACE FUNCTION generate_code() RETURNS text AS $$
DECLARE
  chars text[] := '{0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z}';
  code text := '';
  i integer := 0;
  length integer := 3;
BEGIN
  for i in 1..length LOOP
    code := code || chars[1+random()*(array_length(chars, 1)-1)];
  END LOOP;
  code := code || '-';
  for i in 1..length LOOP
    code := code || chars[1+random()*(array_length(chars, 1)-1)];
  END LOOP;
  RETURN code;
END;
$$ 
LANGUAGE plpgsql;

DO $$
DECLARE
  r RECORD;
  code text := '';
BEGIN
  FOR r IN
    SELECT * FROM "Game"
  LOOP
    -- code := generate_code();
    UPDATE "Game" SET code=generate_code() WHERE id=r.id;
  END LOOP;
END;
$$
LANGUAGE plpgsql;

-- CreateIndex
ALTER TABLE "Game" ALTER COLUMN "code" SET NOT NULL;
CREATE UNIQUE INDEX "Game_code_key" ON "Game"("code");
