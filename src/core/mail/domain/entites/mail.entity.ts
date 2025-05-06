export type CreateMailProps = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  from?: string;
};

export class MailEntity {
  public readonly to: string;
  public readonly from: string;
  public readonly subject: string;
  public readonly text?: string;
  public readonly html?: string;

  constructor({
    to,
    subject,
    text,
    html,
    from = "💬 JCWPP <contato@jcdev.com.br>",
  }: CreateMailProps) {
    if (!to || !subject) {
      throw new Error(
        "Campos obrigatórios 'to' e 'subject' devem ser informados."
      );
    }

    this.to = to;
    this.from = from;
    this.subject = subject;
    this.text = text;
    this.html = html;
  }

  toTransportFormat() {
    return {
      from: this.from,
      to: this.to,
      subject: this.subject,
      text: this.text,
      html: this.html,
    };
  }
}
