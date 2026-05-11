-- Cria a tabela de configurações globais
CREATE TABLE IF NOT EXISTS public.app_settings (
  id integer PRIMARY KEY DEFAULT 1,
  pricing_config jsonb,
  hardware_config jsonb,
  links_config jsonb,
  demo_modules jsonb,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Garante que o ID será sempre 1 (apenas uma linha de configuração global)
ALTER TABLE public.app_settings ADD CONSTRAINT app_settings_single_row CHECK (id = 1);

-- Insere uma linha inicial vazia se não existir
INSERT INTO public.app_settings (id, pricing_config, hardware_config, links_config, demo_modules)
VALUES (1, '{}'::jsonb, '{}'::jsonb, '{}'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Criação do Bucket de Storage (via código)
-- Nota: Isso requer que a extensão de storage esteja instalada. Se der erro, crie manualmente no painel.
INSERT INTO storage.buckets (id, name, public) 
VALUES ('assets', 'assets', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de acesso para Storage
-- Desativando RLS na tabela de configurações para simplificar (já que fizemos o mesmo antes)
ALTER TABLE public.app_settings DISABLE ROW LEVEL SECURITY;

-- Políticas públicas para o bucket 'assets' (Permitir leitura e escrita para todos)
CREATE POLICY "Public Access" ON storage.objects FOR ALL USING (bucket_id = 'assets');
