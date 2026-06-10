from fastapi import WebSocket

connections = []

async def ws_handler(ws: WebSocket):
    await ws.accept()
    connections.append(ws)

    while True:
        data = await ws.receive_text()
        for c in connections:
            await c.send_text(data)
#Footprint Engine (ORDER FLOW)
class FootprintEngine:
    def __init__(self):
        self.rows = []

    def update(self, price, bid, ask):
        self.rows.append({
            "price": price,
            "delta": ask - bid
        })

    def get(self):
        return self.rows[-50:]

fp = FootprintEngine()

#Options Engine (ATM ± Range)
class OptionsEngine:
    def load(self, spot):
        return {
            strike: {
                "oi": 1000 + strike % 100,
                "iv": 15 + strike % 5
            }
            for strike in range(int(spot-200), int(spot+200), 50)
        }

opt = OptionsEngine()

#FastAPI (FULL API)
from fastapi import FastAPI, WebSocket
from engines.execution_engine import engine
from engines.footprint import fp
from engines.options_engine import opt
from ws import ws_handler

app = FastAPI()

@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws_handler(ws)

@app.post("/trade")
def trade(data: dict):
    return engine.place_order(
        data["symbol"], data["side"], data["qty"]
    )

@app.get("/footprint")
def footprint():
    return fp.get()

@app.get("/options")
def options():
    return opt.load(23000)

