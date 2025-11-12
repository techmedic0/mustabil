/*
  # Create Settings Table for Admin Configuration

  1. New Table
    - `settings`
      - `id` (uuid, primary key)
      - `key` (text, unique) - setting identifier
      - `value` (text) - setting value
      - `description` (text) - setting description
      - `updated_at` (timestamptz)
  
  2. Initial Data
    - Insert default delivery fee of 1500
  
  3. Security
    - Enable RLS
    - Anyone can read settings
    - Full control for updates (admin controlled via app logic)
*/

CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  description text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view settings"
  ON settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can update settings"
  ON settings FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can insert settings"
  ON settings FOR INSERT
  TO public
  WITH CHECK (true);

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

INSERT INTO settings (key, value, description)
VALUES ('delivery_fee', '1500', 'Standard delivery fee in Naira')
ON CONFLICT (key) DO NOTHING;
