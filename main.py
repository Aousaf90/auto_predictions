from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import database as database
from controller.auth_controller import auth
from controller.forcasting_controller import forecasting
import uvicorn
import os

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth, prefix='/api/auth')
app.include_router(forecasting, prefix='/api/forecasting')
@app.get("/{full_path:path}")
async def default_file(full_path: str):
    to_send = f"views/{full_path}"
    if os.path.isfile(to_send):
        return FileResponse(to_send)
    else:
        return FileResponse("views/index.html")


if __name__ == "__main__":
    # lifespan_func()
    uvicorn.run("main:app", port=5000, log_level="info")