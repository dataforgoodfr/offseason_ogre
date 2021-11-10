
DROP USER IF EXISTS "default_user";
CREATE USER "default_user" WITH CREATEDB;
DROP DATABASE IF EXISTS "ogre";
CREATE DATABASE "ogre" WITH OWNER = "default_user";

BEGIN;

DROP TABLE IF EXISTS
    team,
    player
CASCADE ;

CREATE TABLE team (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" text NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE player (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" text NOT NULL,
    email text NOT NULL,
    team_id int NOT NULL REFERENCES team(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO team ("name") VALUES ('équipe 1'), ('équipe 2');
INSERT INTO player ("name", "email", "team_id") VALUES
    ('Flo', 'flo@email.com', 1),
    ('Isa', 'isa@email.com', 1),
    ('Gégé', 'gege@email.com', 1),
    ('Laure', 'laure@email.com', 1),
    ('Greg', 'greg@email.com', 2),
    ('Sarah', 'sarah@email.com', 2),
    ('Cam', 'cam@email.com', 2);

COMMIT;