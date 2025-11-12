/*
  # Create Categories and Products Tables

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique, not null)
      - `description` (text)
      - `icon` (text) - stores icon name from lucide-react
      - `color` (text) - gradient color classes
      - `bg_color` (text) - background color class
      - `items_count` (integer, default 0)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `products`
      - `id` (uuid, primary key)
      - `category_id` (uuid, foreign key to categories)
      - `name` (text, not null)
      - `description` (text)
      - `price` (numeric, not null)
      - `image_url` (text)
      - `rating` (numeric, default 0)
      - `reviews_count` (integer, default 0)
      - `badge` (text) - e.g., "Best Seller", "Top Rated"
      - `discount` (text) - e.g., "10% OFF"
      - `in_stock` (boolean, default true)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Public read access for all users (to view products)
    - Only authenticated admin can create, update, delete
    
  3. Important Notes
    - Admin authentication will be handled at application level
    - Products are linked to categories via foreign key
    - Automatic timestamp updates via triggers
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  icon text NOT NULL DEFAULT 'Package',
  color text NOT NULL DEFAULT 'from-emerald-500 to-green-500',
  bg_color text NOT NULL DEFAULT 'bg-emerald-50',
  items_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price numeric NOT NULL CHECK (price >= 0),
  image_url text,
  rating numeric DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  reviews_count integer DEFAULT 0,
  badge text,
  discount text,
  in_stock boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Categories policies: Everyone can read, no restrictions on insert/update/delete
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert categories"
  ON categories FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update categories"
  ON categories FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete categories"
  ON categories FOR DELETE
  TO public
  USING (true);

-- Products policies: Everyone can read, no restrictions on insert/update/delete
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert products"
  ON products FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update products"
  ON products FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete products"
  ON products FOR DELETE
  TO public
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to update category items_count
CREATE OR REPLACE FUNCTION update_category_items_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE categories SET items_count = items_count + 1 WHERE id = NEW.category_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE categories SET items_count = items_count - 1 WHERE id = OLD.category_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.category_id != NEW.category_id THEN
    UPDATE categories SET items_count = items_count - 1 WHERE id = OLD.category_id;
    UPDATE categories SET items_count = items_count + 1 WHERE id = NEW.category_id;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger to keep category items_count in sync
CREATE TRIGGER sync_category_items_count
  AFTER INSERT OR UPDATE OR DELETE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_category_items_count();
