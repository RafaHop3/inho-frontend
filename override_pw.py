import boto3
import time
import base64

ssm = boto3.client('ssm', region_name='us-east-1')
INSTANCE_ID = "i-058e26140671b3254"

# We will run a script inside the container that uses the app's hash_password function to update the DB securely.
script = """
import asyncio
from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def run():
    print(f"Connecting to: {settings.DATABASE_URL}")
    engine = create_async_engine(settings.DATABASE_URL, echo=True)
    async with engine.begin() as conn:
        hashed = pwd_context.hash("Muhammadali")
        await conn.execute(text("UPDATE public.users SET password_hash = :p WHERE email = 'rafael@orbesystems.com.br'"), {'p': hashed})
        print("OVERRIDE SUCCESS!")
    await engine.dispose()

asyncio.run(run())
"""

enc = base64.b64encode(script.encode()).decode()

resp = ssm.send_command(
    InstanceIds=[INSTANCE_ID],
    DocumentName="AWS-RunShellScript",
    Parameters={
        'commands': [
            f"echo '{enc}' | base64 -d > /tmp/override_pw.py",
            "docker cp /tmp/override_pw.py inho-backend-green:/workspace/override_pw.py",
            "docker exec inho-backend-green python3 /workspace/override_pw.py > /tmp/pw_result.txt 2>&1",
            "cat /tmp/pw_result.txt"
        ]
    }
)

cid = resp['Command']['CommandId']
status = "Pending"
inv = None
while status in ["Pending", "InProgress"]:
    time.sleep(2)
    inv = ssm.list_command_invocations(CommandId=cid, Details=True)
    if inv['CommandInvocations']:
        status = inv['CommandInvocations'][0]['Status']

if inv and inv['CommandInvocations']:
    print(inv['CommandInvocations'][0]['CommandPlugins'][0]['Output'].strip())
