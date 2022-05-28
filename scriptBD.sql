CREATE TABLE food (
	id	 BIGINT,
	name	 VARCHAR(512),
	price	 FLOAT(8),
	quantity INTEGER,
	PRIMARY KEY(id)
);

CREATE TABLE orders (
	order_number BIGINT,
	total	 FLOAT(8),
	paid	 BOOL,
	quantity	 INTEGER,
	PRIMARY KEY(order_number)
);

CREATE TABLE locationtag (
	id	 BIGINT,
	occupied BOOL,
	PRIMARY KEY(id)
);

CREATE TABLE employees (
	id	 BIGINT,
	username VARCHAR(512),
	password BIGINT,
	name	 VARCHAR(512),
	admin	 BOOL,
	PRIMARY KEY(id)
);

CREATE TABLE locationtag_orders (
	locationtag_id	 BIGINT,
	orders_order_number BIGINT UNIQUE NOT NULL,
	PRIMARY KEY(locationtag_id)
);

CREATE TABLE food_orders (
	food_id		 BIGINT,
	orders_order_number BIGINT,
	PRIMARY KEY(food_id,orders_order_number)
);

ALTER TABLE locationtag_orders ADD CONSTRAINT locationtag_orders_fk1 FOREIGN KEY (locationtag_id) REFERENCES locationtag(id);
ALTER TABLE locationtag_orders ADD CONSTRAINT locationtag_orders_fk2 FOREIGN KEY (orders_order_number) REFERENCES orders(order_number);
ALTER TABLE food_orders ADD CONSTRAINT food_orders_fk1 FOREIGN KEY (food_id) REFERENCES food(id);
ALTER TABLE food_orders ADD CONSTRAINT food_orders_fk2 FOREIGN KEY (orders_order_number) REFERENCES orders(order_number);

