
DROP DATABASE IF EXISTS "ogre";
DROP USER IF EXISTS "default_user";
CREATE USER "default_user" WITH 
    SUPERUSER
    CREATEDB
    PASSWORD 'default_user';
CREATE DATABASE "ogre" WITH OWNER = "default_user";

\connect "ogre";

BEGIN;

DROP TABLE IF EXISTS
    car_config,
    player
CASCADE ;

CREATE TABLE car_config (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    is_car boolean,
    number_of_adults int,
    number_of_children int,
    carshare_distance int,
    alone_distance int,
    with_household_distance int,
    liter_per_100km int,
    motor_type text,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE plane_config (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    distance_per_year int,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE player (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" text NOT NULL,
    team text,
    car_config_id int REFERENCES car_config(id),
    plane_config_id int REFERENCES plane_config(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO plane_config 
    ("distance_per_year") 
VALUES
    (5000),
    (1000),
    (400);

INSERT INTO car_config 
    ("is_car",
    "number_of_adults",
    "number_of_children",
    "carshare_distance",
    "alone_distance",
    "with_household_distance",
    "liter_per_100km",
    "motor_type") 
VALUES
    (FALSE, 1, 0, 100, NULL, NULL, 7, 'Diesel'),
    (TRUE, 2, 2, NULL, 12000, 5000, 7, 'Diesel');

INSERT INTO player ("name", "team", "car_config_id","plane_config_id") VALUES
    ('Flo', 'Equipe1', 1, 1),
    ('Isa', 'Equipe1', 1, 2),
    ('Gégé', 'Equipe2', 2, 3);

COMMIT;