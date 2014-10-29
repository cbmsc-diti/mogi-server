--
-- PostgreSQL database dump
--

-- Dumped from database version 9.3.5
-- Dumped by pg_dump version 9.3.1
-- Started on 2014-10-28 16:27:45 BRST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- TOC entry 182 (class 3079 OID 12018)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 2275 (class 0 OID 0)
-- Dependencies: 182
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_with_oids = false;

--
-- TOC entry 170 (class 1259 OID 16386)
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "SequelizeMeta" (
    id integer NOT NULL,
    "from" character varying(255),
    "to" character varying(255)
);


--
-- TOC entry 171 (class 1259 OID 16392)
-- Name: SequelizeMeta_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "SequelizeMeta_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2276 (class 0 OID 0)
-- Dependencies: 171
-- Name: SequelizeMeta_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "SequelizeMeta_id_seq" OWNED BY "SequelizeMeta".id;


--
-- TOC entry 172 (class 1259 OID 16394)
-- Name: access_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE access_tokens (
    id uuid NOT NULL,
    scope character varying(255) NOT NULL,
    "expirationDate" timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "userId" bigint
);


--
-- TOC entry 173 (class 1259 OID 16397)
-- Name: groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE groups (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "isAdmin" boolean,
    lat double precision,
    lng double precision
);


--
-- TOC entry 174 (class 1259 OID 16400)
-- Name: groups_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2277 (class 0 OID 0)
-- Dependencies: 174
-- Name: groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE groups_id_seq OWNED BY groups.id;


--
-- TOC entry 175 (class 1259 OID 16402)
-- Name: histories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE histories (
    id integer NOT NULL,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    "previousState" character varying(255),
    "nextState" character varying(255),
    "userId" bigint,
    date timestamp with time zone
);


--
-- TOC entry 176 (class 1259 OID 16408)
-- Name: histories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE histories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2278 (class 0 OID 0)
-- Dependencies: 176
-- Name: histories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE histories_id_seq OWNED BY histories.id;


--
-- TOC entry 177 (class 1259 OID 16410)
-- Name: locations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE locations (
    id integer NOT NULL,
    date timestamp with time zone NOT NULL,
    lat double precision NOT NULL,
    lng double precision NOT NULL,
    "userId" bigint,
    accuracy double precision,
    satellites integer,
    provider character varying(255),
    bearing double precision,
    speed double precision
);


--
-- TOC entry 178 (class 1259 OID 16413)
-- Name: locations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE locations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2279 (class 0 OID 0)
-- Dependencies: 178
-- Name: locations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE locations_id_seq OWNED BY locations.id;


--
-- TOC entry 179 (class 1259 OID 16415)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE users (
    id bigint NOT NULL,
    username character varying(255) NOT NULL,
    "passwordHash" character varying(1024) NOT NULL,
    "passwordSalt" character varying(1024) NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    "gcmRegistration" character varying(1024),
    "isAdmin" boolean DEFAULT false NOT NULL,
    "lastLat" double precision,
    "lastLng" double precision,
    "lastLocationUpdateDate" timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "groupId" integer,
    "profilePicture" character varying(255)
);


--
-- TOC entry 180 (class 1259 OID 16422)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2280 (class 0 OID 0)
-- Dependencies: 180
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- TOC entry 181 (class 1259 OID 16424)
-- Name: videos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE videos (
    id uuid NOT NULL,
    date timestamp with time zone NOT NULL,
    duration integer NOT NULL,
    "userId" integer
);


--
-- TOC entry 2124 (class 2604 OID 16455)
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "SequelizeMeta" ALTER COLUMN id SET DEFAULT nextval('"SequelizeMeta_id_seq"'::regclass);


--
-- TOC entry 2125 (class 2604 OID 16456)
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY groups ALTER COLUMN id SET DEFAULT nextval('groups_id_seq'::regclass);


--
-- TOC entry 2126 (class 2604 OID 16457)
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY histories ALTER COLUMN id SET DEFAULT nextval('histories_id_seq'::regclass);


--
-- TOC entry 2127 (class 2604 OID 16458)
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY locations ALTER COLUMN id SET DEFAULT nextval('locations_id_seq'::regclass);


--
-- TOC entry 2129 (class 2604 OID 16459)
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- TOC entry 2257 (class 0 OID 16386)
-- Dependencies: 170
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO "SequelizeMeta" (id, "from", "to") VALUES (1, '20140318105826', '20140318105826');
INSERT INTO "SequelizeMeta" (id, "from", "to") VALUES (2, '20140506171156', '20140506171156');
INSERT INTO "SequelizeMeta" (id, "from", "to") VALUES (3, '20140530151659', '20140530151659');
INSERT INTO "SequelizeMeta" (id, "from", "to") VALUES (4, '20140530151659', '20140609152651');
INSERT INTO "SequelizeMeta" (id, "from", "to") VALUES (5, '20140714143603', '20140714143603');
INSERT INTO "SequelizeMeta" (id, "from", "to") VALUES (6, '20140923143304', '20140923143304');


--
-- TOC entry 2281 (class 0 OID 0)
-- Dependencies: 171
-- Name: SequelizeMeta_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"SequelizeMeta_id_seq"', 6, true);


--
-- TOC entry 2131 (class 2606 OID 16433)
-- Name: SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (id);


--
-- TOC entry 2133 (class 2606 OID 16435)
-- Name: access_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY access_tokens
    ADD CONSTRAINT access_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 2135 (class 2606 OID 16437)
-- Name: groups_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY groups
    ADD CONSTRAINT groups_name_key UNIQUE (name);


--
-- TOC entry 2137 (class 2606 OID 16439)
-- Name: groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);


--
-- TOC entry 2139 (class 2606 OID 16441)
-- Name: histories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY histories
    ADD CONSTRAINT histories_pkey PRIMARY KEY (id);


--
-- TOC entry 2141 (class 2606 OID 16443)
-- Name: locations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (id);


--
-- TOC entry 2143 (class 2606 OID 16445)
-- Name: users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 2145 (class 2606 OID 16447)
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 2147 (class 2606 OID 16449)
-- Name: users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 2149 (class 2606 OID 16451)
-- Name: videos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY videos
    ADD CONSTRAINT videos_pkey PRIMARY KEY (id);


-- Completed on 2014-10-28 16:27:48 BRST

--
-- PostgreSQL database dump complete
--

