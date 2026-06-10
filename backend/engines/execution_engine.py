from engines.kite_client import client

class ExecutionEngine:

    def place_order(self, symbol, side, qty):
        order = client.kite.place_order(
            tradingsymbol=symbol,
            exchange="NFO",
            transaction_type=side,
            quantity=qty,
            order_type="MARKET",
            product="MIS"
        )
        return order

engine = ExecutionEngine()
