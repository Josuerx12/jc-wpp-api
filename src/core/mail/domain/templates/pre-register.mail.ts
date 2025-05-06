export function generatePreRegisterEmailHTML(userName: string) {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border-radius: 8px; background: #f9f9f9; color: #333;">
    <div style="text-align: center; margin-bottom: 24px;">
      <h1 style="color: #22c55e;">💬 JCWPPAPI</h1>
      <p style="font-size: 16px; color: #555;">Conectando você ao WhatsApp de forma simples, rápida e acessível.</p>
    </div>
    <div style="background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 6px rgba(0,0,0,0.05);">
      <h2 style="color: #111;">Olá ${userName} 👋</h2>
      <p style="margin-top: 12px;">
        Seu <strong>pré-cadastro</strong> foi recebido com sucesso!
      </p>
      <p>
        Em breve, um de nossos especialistas entrará em contato para finalizar seu cadastro e liberar o acesso completo à nossa API.
      </p>
      <p style="margin-top: 12px;">Enquanto isso, fique à vontade para visitar nossa <a href="https://jcdev.com.br" style="color: #22c55e; text-decoration: underline;">página oficial</a> ou entrar em contato com o nosso suporte.</p>
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
