import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import os
import dotenv
from typing import Union

dotenv.load_dotenv()
def send_email(to_address: str, subject: str, message_html: str):
    user = os.getenv("SMTP_FROM_USER")
    smtp_server = os.getenv("SMTP_SERVER")
    smtp_port = os.getenv("SMTP_PORT")
    from_address = os.getenv("SMTP_FROM_ADDRESS")
    password = os.getenv("SMTP_PASSWORD")
    message = MIMEMultipart()
    message["From"] = f"\"{user}\" <{from_address}>"
    message["To"] = to_address
    message["Subject"] = subject
    html = message_html
    message.attach(MIMEText(html, "html"))
    try:
        with smtplib.SMTP_SSL(smtp_server, smtp_port) as server:
            server.login(from_address, password)
            server.send_message(message)
            return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False
    
def send_confiration_email(to_email: str, code: Union[str, int]):
    message_html = f"""\
    <html>
      <head></head>
      <body>
        <p>Hi,<br>
           Here is your email activation code: <b>{code}</b><br>
           Please use this code to activate your account.
        </p>
      </body>
    </html>
    """
    return send_email(to_email, "Confirm Email to Activate Account", message_html)

def send_reset_email(to_email: str, code: Union[str,  int]):
    message_html = f"""\
    <html>
      <head></head>
      <body>
        <p>Hi,<br>
           Here is your password reset code: <b>{code}</b><br>
           Please use this code to reset your password.
        </p>
      </body>
    </html>
    """
    return send_email(to_email, "Confirm Email to Reset Password", message_html)