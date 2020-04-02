exports.up = async function(knex) {
  await knex.raw(sql);
};

exports.down = function(knex) {};

const sql = `
-- FUNCTION: public.update_updated_at_column()

-- DROP FUNCTION public.update_updated_at_column();

CREATE FUNCTION public.update_updated_at_column()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
--https://stackoverflow.com/questions/9556474/how-do-i-automatically-update-a-timestamp-in-postgresql/9556527#9556527
    NEW.updated_at = now();
    RETURN NEW;   
END;
$BODY$;

ALTER FUNCTION public.update_updated_at_column()
    OWNER TO postgres;


-- Table: public.sellers

-- DROP TABLE public.sellers;

CREATE TABLE public.sellers
(
    seller_id character varying(32) COLLATE pg_catalog."default" NOT NULL,
    company_name character varying(128) COLLATE pg_catalog."default" NOT NULL,
    contact_name character varying(128) COLLATE pg_catalog."default" NOT NULL,
    email character varying(64) COLLATE pg_catalog."default" NOT NULL,
    address character varying(64) COLLATE pg_catalog."default" NOT NULL,
    city character varying(32) COLLATE pg_catalog."default",
    state character varying(32) COLLATE pg_catalog."default",
    country character varying(64) COLLATE pg_catalog."default" NOT NULL,
    zip character varying(12) COLLATE pg_catalog."default",
    phone character varying(32) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT sellers_pkey PRIMARY KEY (seller_id)
)

TABLESPACE pg_default;

ALTER TABLE public.sellers
    OWNER to postgres;
	
	
-- Table: public.products

-- DROP TABLE public.products;

CREATE TABLE public.products
(
    product_id character varying(32) COLLATE pg_catalog."default" NOT NULL,
    seller_id character varying(32) COLLATE pg_catalog."default" NOT NULL,
    product_name character varying(128) COLLATE pg_catalog."default" NOT NULL,
    description character varying(1000) COLLATE pg_catalog."default",
    unit_price numeric NOT NULL,
    CONSTRAINT products_pkey PRIMARY KEY (product_id, seller_id)
)

TABLESPACE pg_default;

ALTER TABLE public.products
    OWNER to postgres;
	
-- Table: public.carts

-- DROP TABLE public.carts;

CREATE TABLE public.carts
(
    cart_id character varying(32) COLLATE pg_catalog."default" NOT NULL,
    cart_owner character varying(64) COLLATE pg_catalog."default",
    status character varying(12) COLLATE pg_catalog."default" NOT NULL,
    total numeric NOT NULL DEFAULT 0,
    checkout_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT carts_pkey PRIMARY KEY (cart_id)
)

TABLESPACE pg_default;

ALTER TABLE public.carts
    OWNER to postgres;

-- Trigger: update_carts_updated_at

-- DROP TRIGGER update_carts_updated_at ON public.carts;

CREATE TRIGGER update_carts_updated_at
    BEFORE UPDATE 
    ON public.carts
    FOR EACH ROW
    EXECUTE PROCEDURE public.update_updated_at_column();	
	
-- Table: public.cart_items

-- DROP TABLE public.cart_items;

CREATE TABLE public.cart_items
(
    cart_id character varying(32) COLLATE pg_catalog."default" NOT NULL,
    product_id character varying(32) COLLATE pg_catalog."default" NOT NULL,
    seller_id character varying(32) COLLATE pg_catalog."default" NOT NULL,
    product_name character varying(128) COLLATE pg_catalog."default" NOT NULL,
    description character varying(100) COLLATE pg_catalog."default",
    quantity numeric NOT NULL,
    unit_price numeric NOT NULL,
    sub_total numeric NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT cart_items_pkey PRIMARY KEY (cart_id, product_id, seller_id)
)

TABLESPACE pg_default;

ALTER TABLE public.cart_items
    OWNER to postgres;

-- Trigger: update_cart_items_updated_at

-- DROP TRIGGER update_cart_items_updated_at ON public.cart_items;

CREATE TRIGGER update_cart_items_updated_at
    BEFORE UPDATE 
    ON public.cart_items
    FOR EACH ROW
    EXECUTE PROCEDURE public.update_updated_at_column();`;
