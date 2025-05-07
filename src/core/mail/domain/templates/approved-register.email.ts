export function generateApprovedRegisterEmailHTML(
  userName: string,
  tempPass: string
) {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border-radius: 8px; background: #f9f9f9; color: #333;">
    <div style="text-align: center; margin-bottom: 24px;">
      <h1 style="color: #22c55e;">💬 JCWPPAPI</h1>
      <p style="font-size: 16px; color: #555;">Bem-vindo à nossa API de WhatsApp profissional!</p>
    </div>
    <div style="background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 6px rgba(0,0,0,0.05);">
      <h2 style="color: #111;">Olá ${userName} 👋</h2>
      <p style="margin-top: 12px;">
        Seu <strong>cadastro foi aprovado</strong> com sucesso! Agora você já pode acessar sua conta.
      </p>
      <p style="margin: 16px 0;">Aqui está sua <strong>senha temporária</strong>:</p>
      <div style="text-align: center; margin: 12px 0;">
        <code style="background: #f1f1f1; padding: 12px 16px; border-radius: 6px; font-size: 18px; font-weight: bold; color: #111;">
          ${tempPass}
        </code>
      </div>
      <p style="margin-top: 16px;">
        ⚠️ Por segurança, você <strong>deverá alterar essa senha</strong> no seu primeiro acesso à plataforma.
      </p>
      <p style="margin-top: 12px;">Acesse o painel por aqui: <a href="https://jcwpp.jcdev.com.br" style="color: #22c55e; text-decoration: underline;">jcwpp.jcdev.com.br</a></p>

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
