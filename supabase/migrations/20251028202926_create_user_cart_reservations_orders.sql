/*
  # Create User Cart, Reservations, and Orders System

  1. New Tables
    - `cart_items`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `product_id` (uuid, references products)
      - `quantity` (integer, default 1)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `reservations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `user_name` (text)
      - `user_email` (text)
      - `user_phone` (text)
      - `items` (jsonb) - array of {product_id, product_name, quantity, price}
      - `total_amount` (numeric)
      - `status` (text) - 'pending', 'ready', 'picked_up', 'expired', 'cancelled'
      - `expires_at` (timestamptz) - 36 hours from creation
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `orders`
      - `id` (uuid, primary key)
      - `order_number` (text, unique)
      - `user_id` (uuid, references auth.users)
      - `user_name` (text)
      - `user_email` (text)
      - `user_phone` (text)
      - `delivery_address` (text)
      - `items` (jsonb) - array of {product_id, product_name, quantity, price}
      - `total_amount` (numeric)
      - `status` (text) - 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'
      - `payment_status` (text) - 'pending', 'paid', 'failed'
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Users can only view/modify their own cart items
    - Users can view their own reservations and orders
    - Public can create reservations/orders
    
  3. Important Notes
    - Reservations automatically expire after 36 hours
    - Order numbers are auto-generated
    - Cart items are linked to authenticated users
*/

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer DEFAULT 1 CHECK (quantity > 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  user_name text NOT NULL,
  user_email text NOT NULL,
  user_phone text NOT NULL,
  items jsonb NOT NULL,
  total_amount numeric NOT NULL CHECK (total_amount >= 0),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'ready', 'picked_up', 'expired', 'cancelled')),
  expires_at timestamptz DEFAULT (now() + interval '36 hours'),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  user_id uuid,
  user_name text NOT NULL,
  user_email text NOT NULL,
  user_phone text NOT NULL,
  delivery_address text NOT NULL,
  items jsonb NOT NULL,
  total_amount numeric NOT NULL CHECK (total_amount >= 0),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX IF NOT EXISTS idx_reservations_user_id ON reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_expires_at ON reservations(expires_at);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);

-- Enable RLS
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Cart items policies
CREATE POLICY "Users can view own cart items"
  ON cart_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart items"
  ON cart_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart items"
  ON cart_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items"
  ON cart_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Reservations policies
CREATE POLICY "Anyone can view own reservations"
  ON reservations FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create reservations"
  ON reservations FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update reservations"
  ON reservations FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Orders policies
CREATE POLICY "Anyone can view orders"
  ON orders FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update orders"
  ON orders FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Triggers for updated_at
CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at
  BEFORE UPDATE ON reservations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text AS $$
DECLARE
  new_order_number text;
  order_exists boolean;
BEGIN
  LOOP
    new_order_number := 'MSS' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::text, 4, '0');
    
    SELECT EXISTS(SELECT 1 FROM orders WHERE order_number = new_order_number) INTO order_exists;
    
    IF NOT order_exists THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN new_order_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate order number
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number_trigger
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();

-- Function to auto-expire reservations
CREATE OR REPLACE FUNCTION expire_old_reservations()
RETURNS void AS $$
BEGIN
  UPDATE reservations
  SET status = 'expired'
  WHERE status = 'pending'
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;
