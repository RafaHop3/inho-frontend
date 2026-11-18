import { test, expect } from '@playwright/test';

const MOCK_JWT = [
  Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url'),
  Buffer.from(
    JSON.stringify({
      sub: '00000000-0000-0000-0000-000000000001',
      email: 'rafael@orbesystems.com.br',
      role: 'admin',
      exp: 1999999999,
    })
  ).toString('base64url'),
  'mocksignature',
].join('.');

test.describe('OrbeJobs — Painel Next.js, Living CV, Human-in-the-Loop e Auditoria LGPD', () => {
  test('E2E-ORBEJOBS-01: Kanban, Living CV XP/Cursos, Kill-Switch, LGPD e Zero Marcas Externas', async ({ page }) => {
    let killSwitchActive = false;
    let humanInLoop = true;
    const workItems = [
      { name: 'Orbe Systems', position: 'Staff Software Engineer', startDate: '2026-01-01', summary: 'FastAPI e pgvector' },
    ];
    const certItems = [{ name: 'Engenharia Z3', issuer: 'Orbe Academy', date: '2026-06-01' }];
    const apps = [
      {
        id: 'app-1',
        job_url_hash: 'abc123',
        company_name: 'Acme Cloud',
        job_title: 'Senior Python Backend',
        job_url: 'https://acme.example.com/jobs/1',
        recipient_email: 'jobs@acme.example.com',
        stage: 'DISCOVERED',
        match_score: 0.87,
        requires_approval: true,
        approved_by_human: false,
      },
    ];

    await page.route('**/api/v1/auth/refresh', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ access_token: MOCK_JWT, token_type: 'bearer' }),
      })
    );

    await page.route('**/api/v1/users/me', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '00000000-0000-0000-0000-000000000001',
          email: 'rafael@orbesystems.com.br',
          full_name: 'Rafael Machado',
          role: 'admin',
        }),
      })
    );

    await page.route('**/api/v1/orbejobs/dashboard', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          business_id: 'biz-01',
          profile: {
            id: 'cv-1',
            business_id: 'biz-01',
            user_id: '00000000-0000-0000-0000-000000000001',
            full_name: 'Rafael Machado',
            headline: 'Arquiteto Orbe',
            target_roles: ['Backend Engineer'],
            json_resume: {
              basics: { name: 'Rafael Machado', label: 'Arquiteto Orbe', email: 'rafael@orbesystems.com.br', summary: '' },
              work: workItems,
              education: [],
              certificates: certItems,
              skills: [{ name: 'Core', keywords: ['Python', 'FastAPI', 'pgvector'] }],
              languages: [{ language: 'Português', fluency: 'Nativo' }],
            },
            human_in_the_loop: humanInLoop,
            daily_send_limit: 12,
            kill_switch_active: killSwitchActive,
          },
          daily_quota: { sent_today: 2, daily_send_limit: 12, hard_cap: 15, remaining_today: 10 },
          oauth_vault: { connected: true, provider: 'gmail', account_email: 'rafael@gmail.com', cipher_algorithm: 'MultiFernet AES-256' },
          listings_count: 1,
          stage_counts: { DISCOVERED: 1 },
          applications: apps,
          queue: [],
        }),
      })
    );

    await page.route('**/api/v1/orbejobs/lgpd/audit', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          send_logs: [
            {
              id: 'log-1',
              recipient_email: 'jobs@acme.example.com',
              gmail_message_id: 'msg-1',
              mx_host: 'mx1.acme.example.com',
              status: 'SENT_SANDBOX',
              latency_ms: 42,
              lgpd_audit_hash: 'f8d2c1b0a9e8d7c6',
              created_at: '2026-11-18T16:00:00Z',
            },
          ],
          audit_events: [
            {
              id: 'ev-1',
              entity: 'ORBEJOBS_LIVING_CV',
              action: 'UPDATE',
              detail: 'Living CV JSON Resume atualizado.',
              timestamp: '2026-11-18T16:01:00Z',
            },
          ],
        }),
      })
    );

    await page.route('**/api/v1/orbejobs/living-cv', async (route) => {
      if (route.request().method() === 'PUT') {
        const body = route.request().postDataJSON();
        if (typeof body.human_in_the_loop === 'boolean') humanInLoop = body.human_in_the_loop;
        if (body.json_resume?.work) {
          workItems.splice(0, workItems.length, ...body.json_resume.work);
        }
        if (body.json_resume?.certificates) {
          certItems.splice(0, certItems.length, ...body.json_resume.certificates);
        }
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'cv-1',
            business_id: 'biz-01',
            user_id: '00000000-0000-0000-0000-000000000001',
            full_name: 'Rafael Machado',
            target_roles: ['Backend Engineer'],
            json_resume: {
              basics: { name: 'Rafael Machado', label: 'Arquiteto Orbe', email: 'rafael@orbesystems.com.br', summary: '' },
              work: workItems,
              education: [],
              certificates: certItems,
              skills: [],
              languages: [],
            },
            human_in_the_loop: humanInLoop,
            daily_send_limit: 12,
            kill_switch_active: killSwitchActive,
          }),
        });
      }
      return route.continue();
    });

    await page.route('**/api/v1/orbejobs/kill-switch', async (route) => {
      const body = route.request().postDataJSON();
      killSwitchActive = !!body.active;
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ kill_switch_active: killSwitchActive, reason: body.reason || 'ok' }),
      });
    });

    const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3000';
    await page.goto(`${baseUrl}/login`, { waitUntil: 'domcontentloaded' });
    await page.evaluate((tok) => {
      localStorage.setItem('token', tok);
      localStorage.setItem('inho_access_token', tok);
      localStorage.setItem('@inho:biz', 'biz-01');
    }, MOCK_JWT);

    await page.goto(`${baseUrl}/dashboard/orbejobs`, { waitUntil: 'networkidle' });

    // 1. Kanban visível com vaga coletada
    await expect(page.getByTestId('orbejobs-kanban-board')).toBeVisible();
    await expect(page.locator('text=Senior Python Backend')).toBeVisible();

    // 2. Toggle Human-in-the-Loop e Kill-Switch
    await page.getByTestId('orbejobs-hil-toggle').click();
    await expect(page.getByTestId('orbejobs-hil-toggle')).toContainText('OPCIONAL (AUTO)');
    await page.getByTestId('orbejobs-killswitch-btn').click();
    await expect(page.getByTestId('orbejobs-killswitch-btn')).toContainText('KILL-SWITCH ATIVO');

    // 3. Aba Living CV: adicionar XP + Curso
    await page.getByTestId('tab-living_cv').click();
    await page.getByTestId('input-xp-company').fill('Orbe Labs');
    await page.getByTestId('input-xp-position').fill('Principal Security Architect');
    await page.getByTestId('input-course-name').fill('Formal Verification Z3');
    await page.getByTestId('btn-save-living-cv').click();
    await expect(page.locator('text=Principal Security Architect')).toBeVisible();
    await expect(page.locator('text=Formal Verification Z3')).toBeVisible();

    // 4. Aba LGPD Audit Trail
    await page.getByTestId('tab-lgpd').click();
    await expect(page.locator('text=ORBEJOBS_LIVING_CV')).toBeVisible();
    await expect(page.locator('text=f8d2c1b0a9e8d7c6')).toBeVisible();

    // 5. Garantir zero vazamento de marcas externas no DOM
    const html = (await page.content()).toLowerCase();
    expect(html).not.toContain('google gemini');
    expect(html).not.toContain('gemini 1.5 flash');
  });
});
