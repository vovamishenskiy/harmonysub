import { NextResponse } from 'next/server'
import axios from 'axios'

interface RequestBody {
    email: string
    name: string
    username: string
}

export async function POST(request: Request) {
    const { email, name, username } = (await request.json()) as RequestBody

    try {
        const brevoRes = await axios.post(
            'https://api.brevo.com/v3/smtp/email',
            {
                sender: {
                    name: 'Harmonysub',
                    email: 'info@harmonysub.ru',
                },
                to: [
                    {
                        email,
                        name,
                    },
                ],
                subject: 'Добро пожаловать в HarmonySub!',
                htmlContent: `
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" align="center">
                        <tr>
                            <td class="t41" style="font-size:0;line-height:0;mso-line-height-rule:exactly;background-color:#ffffff;"
                                valign="top" align="center">
                                <!--[if mso]>
                                <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false">
                                <v:fill color="#ffffff"/>
                                </v:background>
                                <![endif]-->
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" align="center"
                                    id="innerTable">
                                    <tr>
                                        <td align="center">
                                            <table class="t40" role="presentation" cellpadding="0" cellspacing="0"
                                                style="Margin-left:auto;Margin-right:auto;">
                                                <tr>
                                                    <td width="575" class="t39" style="width:575px;">
                                                        <table class="t38" role="presentation" cellpadding="0" cellspacing="0"
                                                            width="100%" style="width:100%;">
                                                            <tr>
                                                                <td class="t37"
                                                                    style="border:24px solid #065F46;overflow:hidden;background-color:#FFFFFF;padding:80px 40px 80px 40px;border-radius:28px 28px 28px 28px;">
                                                                    <table role="presentation" width="100%" cellpadding="0"
                                                                        cellspacing="0" style="width:100% !important;">
                                                                        <tr>
                                                                            <td>
                                                                                <div class="t5"
                                                                                    style="mso-line-height-rule:exactly;mso-line-height-alt:40px;line-height:40px;font-size:1px;display:block;">
                                                                                    &nbsp;&nbsp;</div>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>
                                                                                <div class="t7"
                                                                                    style="mso-line-height-rule:exactly;mso-line-height-alt:40px;line-height:40px;font-size:1px;display:block;">
                                                                                    &nbsp;&nbsp;</div>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td align="center">
                                                                                <table class="t11" role="presentation"
                                                                                    cellpadding="0" cellspacing="0"
                                                                                    style="Margin-left:auto;Margin-right:auto;">
                                                                                    <tr>
                                                                                        <td width="447" class="t10"
                                                                                            style="width:600px;">
                                                                                            <table class="t9" role="presentation"
                                                                                                cellpadding="0" cellspacing="0"
                                                                                                width="100%" style="width:100%;">
                                                                                                <tr>
                                                                                                    <td class="t8">
                                                                                                        <h1 class="t6"
                                                                                                            style="margin:0;Margin:0;font-family:Roboto,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:34px;font-weight:700;font-style:normal;font-size:28px;text-decoration:none;text-transform:none;direction:ltr;color:#065F46;text-align:center;mso-line-height-rule:exactly;mso-text-raise:2px;">
                                                                                                            Привет, ${name}!</h1>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>
                                                                                <div class="t12"
                                                                                    style="mso-line-height-rule:exactly;mso-line-height-alt:40px;line-height:40px;font-size:1px;display:block;">
                                                                                    &nbsp;&nbsp;</div>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td align="center">
                                                                                <table class="t17" role="presentation"
                                                                                    cellpadding="0" cellspacing="0"
                                                                                    style="Margin-left:auto;Margin-right:auto;">
                                                                                    <tr>
                                                                                        <td width="447" class="t16"
                                                                                            style="width:600px;">
                                                                                            <table class="t15" role="presentation"
                                                                                                cellpadding="0" cellspacing="0"
                                                                                                width="100%" style="width:100%;">
                                                                                                <tr>
                                                                                                    <td class="t14">
                                                                                                        <p class="t13"
                                                                                                            style="margin:0;Margin:0;font-family:Roboto,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:22px;font-weight:500;font-style:normal;font-size:22px;text-decoration:none;text-transform:none;direction:ltr;color:#065F46;text-align:center;mso-line-height-rule:exactly;">
                                                                                                            Добро пожаловать в
                                                                                                            Harmonysub, Вы успешно
                                                                                                            зарегистрировались и
                                                                                                            готовы к управлению
                                                                                                            своими подписками!</p>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>
                                                                                <div class="t18"
                                                                                    style="mso-line-height-rule:exactly;mso-line-height-alt:40px;line-height:40px;font-size:1px;display:block;">
                                                                                    &nbsp;&nbsp;</div>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td align="center">
                                                                                <table class="t23" role="presentation"
                                                                                    cellpadding="0" cellspacing="0"
                                                                                    style="Margin-left:auto;Margin-right:auto;">
                                                                                    <tr>
                                                                                        <td width="447" class="t22"
                                                                                            style="width:600px;">
                                                                                            <table class="t21" role="presentation"
                                                                                                cellpadding="0" cellspacing="0"
                                                                                                width="100%" style="width:100%;">
                                                                                                <tr>
                                                                                                    <td class="t20">
                                                                                                        <p class="t19"
                                                                                                            style="margin:0;Margin:0;font-family:Roboto,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:22px;font-weight:500;font-style:normal;font-size:22px;text-decoration:none;text-transform:none;direction:ltr;color:#065F46;text-align:left;mso-line-height-rule:exactly;">
                                                                                                            Регистрационные данные:
                                                                                                        </p>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>
                                                                                <div class="t24"
                                                                                    style="mso-line-height-rule:exactly;mso-line-height-alt:10px;line-height:10px;font-size:1px;display:block;">
                                                                                    &nbsp;&nbsp;</div>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td align="center">
                                                                                <table class="t30" role="presentation"
                                                                                    cellpadding="0" cellspacing="0"
                                                                                    style="Margin-left:auto;Margin-right:auto;">
                                                                                    <tr>
                                                                                        <td width="447" class="t29"
                                                                                            style="width:600px;">
                                                                                            <table class="t28" role="presentation"
                                                                                                cellpadding="0" cellspacing="0"
                                                                                                width="100%" style="width:100%;">
                                                                                                <tr>
                                                                                                    <td class="t27">
                                                                                                        <p class="t26"
                                                                                                            style="margin:0;Margin:0;font-family:Roboto,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:22px;font-weight:400;font-style:normal;font-size:18px;text-decoration:none;text-transform:none;direction:ltr;color:#065F46;text-align:left;mso-line-height-rule:exactly;mso-text-raise:1px;">
                                                                                                            Имя пользователя: <span
                                                                                                                class="t25"
                                                                                                                style="margin:0;Margin:0;font-weight:500;mso-line-height-rule:exactly;">${username}</span>
                                                                                                        </p>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td align="center">
                                                                                <table class="t36" role="presentation"
                                                                                    cellpadding="0" cellspacing="0"
                                                                                    style="Margin-left:auto;Margin-right:auto;">
                                                                                    <tr>
                                                                                        <td width="447" class="t35"
                                                                                            style="width:612px;">
                                                                                            <table class="t34" role="presentation"
                                                                                                cellpadding="0" cellspacing="0"
                                                                                                width="100%" style="width:100%;">
                                                                                                <tr>
                                                                                                    <td class="t33">
                                                                                                        <p class="t32"
                                                                                                            style="margin:0;Margin:0;font-family:Roboto,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:22px;font-weight:400;font-style:normal;font-size:18px;text-decoration:none;text-transform:none;direction:ltr;color:#065F46;text-align:left;mso-line-height-rule:exactly;mso-text-raise:1px;">
                                                                                                            e-mail (для входа по
                                                                                                            e-mail): <span
                                                                                                                class="t31"
                                                                                                                style="margin:0;Margin:0;font-weight:500;mso-line-height-rule:exactly;">${email}</span>
                                                                                                        </p>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <div class="gmail-fix" style="display: none; white-space: nowrap; font: 15px courier; line-height: 0;">&nbsp; &nbsp;
                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                    </div>
                `,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': process.env.BREVO_API_KEY!,
                },
            }
        )

        if (brevoRes.status === 201 || brevoRes.status === 200) {
            return NextResponse.json({ ok: true })
        } else {
            console.error('Brevo error payload:', brevoRes.data)
            return NextResponse.json(
                { error: 'Brevo вернул ошибку при отправке' },
                { status: 500 }
            )
        }
    } catch (err: any) {
        console.error('Ошибка Brevo:', err.response?.data || err.message)
        return NextResponse.json(
            { error: 'Не удалось отправить письмо через Brevo' },
            { status: 500 }
        )
    }
}