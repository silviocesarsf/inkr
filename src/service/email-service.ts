import { resend } from "../lib/resend";

export const sendVerificationToken = async (token: string, to: string) => {
    if (!token || !to) {
        return;
    }

    try {
        const data = await resend.emails.send({
            from: "onboarding@resend.dev",
            to,
            subject: "Email de verificação",
            html: `<p>Seu token de validação é: <b>${token}</b><br><p>ou clique <a>Aqui</a> para redirecionar ao site.</p></p>`
        });

        console.log("Email enviado: ", data);
    } catch(err) {
        console.error(err)
    }
}