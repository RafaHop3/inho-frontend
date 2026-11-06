import { test, expect } from '@playwright/test';

const MOCK_JWT = 'eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJzdWIiOiAiMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAxIiwgImVtYWlsIjogIm9wZXJhZG9yQG9yYmVzeXN0ZW1zLmNvbS5iciIsICJyb2xlIjogIm9wZXJhdG9yIiwgImV4cCI6IDE5OTk5OTk5OTl9.mocksignature';

test.describe('Orbe Systems & INHO ERP — Homologação E2E no Navegador', () => {

  test('SEO-01 & MKT-01: Verificação de Metatags Google e Campanha Comercial no Hub', async ({ page }) => {
    // 1. Acessa a vitrine comercial oficial
    await page.goto('https://www.orbesystems.com.br', { waitUntil: 'domcontentloaded' });

    // 2. Valida Título Otimizado para o Google
    const pageTitle = await page.title();
    expect(pageTitle).toContain('INHO ERP');
    expect(pageTitle).toContain('Smart POS');
    expect(pageTitle).toContain('Nota Fiscal');

    // 3. Valida Injeção de Dados Estruturados Schema.org JSON-LD
    const jsonLdLocator = page.locator('script[type="application/ld+json"]');
    await expect(jsonLdLocator).toBeAttached();

    const jsonText = await jsonLdLocator.first().textContent();
    expect(jsonText).toContain('SoftwareApplication');
    expect(jsonText).toContain('The Orbe Systems');

    // 4. Valida Campanha Comercial "Mais Dinheiro no Caixa"
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toContain('Mais Dinheiro no Caixa');
    expect(bodyText).toContain('Menos Trabalho Manual');
  });

  test('MKT-02: Validação da Página de Planos (/assinar) & FAQ Oficial Fiscal e Maquininha', async ({ page }) => {
    // 1. Acessa o portal de contratação Zero-Fricção
    await page.goto('https://www.orbesystems.com.br/assinar', { waitUntil: 'networkidle' });

    // 2. Valida presença dos 3 Planos
    await expect(page.locator('text=INHO ESSENCIAL')).toBeVisible();
    await expect(page.locator('text=INHO PRO + ORBRICK-IA')).toBeVisible();
    await expect(page.locator('text=ENTERPRISE & CORPORATIVO')).toBeVisible();

    // 3. Valida FAQ Comercial Oficial respondendo diretamente sobre Nota Fiscal e Maquininhas
    const bodyContent = await page.locator('body').textContent();
    expect(bodyContent).toContain('O INHO ERP consegue gerar Nota Fiscal?');
    expect(bodyContent).toContain('Nossos assinantes podem usar maquininha física de cartão no balcão?');
    expect(bodyContent).toContain('Como funciona a cobrança automática via WhatsApp com PIX?');
    expect(bodyContent).toContain('O que é o Co-piloto Orbe AI com Poder ROOT?');
  });

  test('API-01: Verificação de Latência e Privilégios ROOT do Endpoint Copilot', async ({ request }) => {
    // 1. Dispara requisição direta ao backend live na EC2
    const start = Date.now();
    const response = await request.post('https://inho-api.orbesystems.com.br/api/v1/copilot/root_assist', {
      data: {
        query: 'Como parear a maquininha Stripe Terminal WisePOS E?',
        context_screen: 'settings'
      }
    });

    const elapsedMs = Date.now() - start;

    // 2. Valida Status HTTP 200 OK e tempo de resposta
    expect(response.status()).toBe(200);
    expect(elapsedMs).toBeLessThan(1500);

    // 3. Valida Payload com Privilégio ROOT
    const data = await response.json();
    expect(data.root_status).toBe('ROOT_PRIVILEGE_ACTIVE');
    expect(data.suggested_actions.length).toBeGreaterThanOrEqual(2);
    expect(data.reply).toContain('PODER ROOT ATIVO');
  });

  test('SEC-01: Eradicação Total de Marcas Externas nos Front-ends (100% Orbe AI)', async ({ page }) => {
    // 1. Acessa o portal e verifica que referências externas não vazam no front-end
    await page.goto('https://www.orbesystems.com.br', { waitUntil: 'domcontentloaded' });
    const content = (await page.content()).toLowerCase();

    expect(content).not.toContain('google gemini');
    expect(content).not.toContain('gemini 1.5 flash');
    expect(content).not.toContain('gemini 2.0');
  });

  test('RT-01 & RT-02: Acionamento da HUD Orbe Assistant ROOT com Alt + A e Clique', async ({ page }) => {
    // 1. Mock de rotas de autenticação para sessão de operador
    await page.route('**/api/v1/users/me', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: '00000000-0000-0000-0000-000000000001',
        email: 'operador@orbesystems.com.br',
        full_name: 'Operador Playwright E2E',
        role: 'operator',
        business_id: 'biz-test-01'
      })
    }));

    await page.route('**/api/v1/auth/refresh', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ access_token: MOCK_JWT })
    }));

    // 2. Prepara a sessão do operador no portal INHO
    await page.goto('https://inho.orbesystems.com.br/login');
    await page.evaluate((token) => {
      localStorage.setItem('token', token);
      localStorage.setItem('inho_access_token', token);
      localStorage.setItem('@inho:biz', 'biz-test-01');
    }, MOCK_JWT);

    // 3. Acessa o Dashboard
    await page.goto('https://inho.orbesystems.com.br/dashboard', { waitUntil: 'networkidle' });

    // 4. Valida se o launcher da Orbe AI está visível no canto inferior direito
    const launcher = page.locator('[data-testid="orbe-assistant-launcher"]');
    await expect(launcher).toBeVisible({ timeout: 10000 });

    // 5. Aciona a HUD via Clique no Launcher (RT-01)
    await launcher.click();

    // 6. Valida se o modal HUD do assistente abriu instantaneamente
    const hudModal = page.locator('[data-testid="orbe-assistant-hud"]');
    await expect(hudModal).toBeVisible({ timeout: 5000 });

    // 7. Valida a badge oficial de privilégio ROOT ativo
    const rootBadge = page.locator('[data-testid="root-status-badge"]');
    await expect(rootBadge).toBeVisible();
    await expect(rootBadge).toContainText('ROOT PRIVILEGE');

    // 8. Fecha a HUD via botão de fechar ou atalho Alt+A (RT-02)
    const closeBtn = page.locator('button[title="Fechar (Alt+A)"]');
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
      await expect(hudModal).not.toBeVisible({ timeout: 5000 });
    }

    // 9. Reabre e testa o atalho global Alt+A
    await page.focus('body');
    await page.keyboard.press('Alt+A');
    await expect(hudModal).toBeVisible({ timeout: 5000 });

    // 10. Fecha novamente via Alt+A
    await page.keyboard.press('Alt+A');
    await expect(hudModal).not.toBeVisible({ timeout: 5000 });
  });

});
