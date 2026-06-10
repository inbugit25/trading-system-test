import TradePanel from "./TradePanel";
import Footprint from "./Footprint";
import Options from "./Options";
import Orders from "./Orders";

export default function App(){
  return (
    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr"}}>
      <div>
        <Footprint />
      </div>

      <div>
        <TradePanel/>
        <Options/>
        <Orders/>
      </div>
    </div>
  )
}

#TRADE PANEL (LIVE EXECUTION)
export default function TradePanel(){

  const place = async (side) => {
    await fetch("http://localhost:8000/trade",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({
        symbol:"NIFTY",
        side:side,
        qty:1
      })
    });
  };

  return (
    <div>
      <button onClick={()=>place("BUY")}>BUY</button>
      <button onClick={()=>place("SELL")}>SELL</button>
    </div>
  );
}

#FOOTPRINT HEATMAP (KEY FEATURE)
import React,{useEffect,useState} from "react";

export default function Footprint(){

  const [data,setData]=useState([]);

  useEffect(()=>{
    const i=setInterval(async()=>{
      const r=await fetch("http://localhost:8000/footprint");
      const d=await r.json();
      setData(d);
    },1000);

    return ()=>clearInterval(i);
  },[]);

  return (
    <div>
      {data.map((r,i)=>(
        <div key={i}
          style={{
            background: r.delta>0 ? "green":"red",
            color:"white"
          }}>
          {r.price} : {r.delta}
        </div>
      ))}
    </div>
  );
}

#OPTIONS PANEL
import React,{useEffect,useState} from "react";

export default function Options(){

  const [data,setData]=useState({});

  useEffect(()=>{
    setInterval(async()=>{
      const r=await fetch("http://localhost:8000/options");
      const d=await r.json();
      setData(d);
    },2000);
  },[]);

  return (
    <div>
      {Object.entries(data).map(([k,v])=>(
        <div key={k}>
          {k} | IV:{v.iv} | OI:{v.oi}
        </div>
      ))}
    </div>
  );
}

#LIVE ORDERS STREAM
import React,{useEffect,useState} from "react";

export default function Orders(){

  const [orders,setOrders]=useState([]);

  useEffect(()=>{
    const ws=new WebSocket("ws://localhost:8000/ws");

    ws.onmessage = e=>{
      setOrders(o=>[...o.slice(-10), e.data]);
    };
  },[]);

  return (
    <div>
      {orders.map((o,i)=>(<div key={i}>{o}</div>))}
    </div>
  );
}


