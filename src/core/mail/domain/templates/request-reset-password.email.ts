export function generateResetPasswordEmailHTML(
  userName: string,
  code: string,
  resetUrl: string
) {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border-radius: 8px; background: #f9f9f9; color: #333;">
    <div style="text-align: center; margin-bottom: 24px;">
      <h1 style="color: #22c55e;">💬 JCWPPAPI</h1>
      <p style="font-size: 16px; color: #555;">Conectando você ao WhatsApp de forma simples, rápida e acessível.</p>
    </div>
    <div style="background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 6px rgba(0,0,0,0.05);">
      <h2 style="color: #111;">Olá ${userName} 👋</h2>
      <p style="margin-top: 12px;">
        Recebemos uma solicitação para <strong>resetar sua senha</strong>.
      </p>
      <p>
        Utilize o código abaixo para redefinir sua senha:
      </p>
      <div style="margin: 20px 0; text-align: center;">
        <span style="display: inline-block; background: #22c55e; color: #fff; font-size: 22px; padding: 10px 32px; border-radius: 6px; letter-spacing: 2px;">
          ${code}
        </span>
      </div>
      <p>
        Ou, se preferir, clique no botão abaixo para ir diretamente à página de redefinição:
      </p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${resetUrl}" style="background: #22c55e; color: #fff; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 16px;">
          Redefinir Senha
        </a>
      </div>
      <p style="margin-top: 12px;">
        Se você não solicitou a redefinição de senha, ignore este e-mail. Sua conta permanecerá segura.
      </p>
      <div style="margin-top: 20px; font-size: 14px; color: #999;">
        Este é um email automático. Por favor, não responda.
      </div>
    </div>
    <footer style="text-align: center; margin-top: 32px; font-size: 12px; color: #aaa;">
      © ${new Date().getFullYear()} JCWPPAPI - Todos os direitos reservados.
    </footer>
  </div>
  `;
}
