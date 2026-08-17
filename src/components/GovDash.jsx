import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Cell,
} from "recharts";
import { AlertTriangle, BarChart3, ShieldAlert, TrendingUp } from "lucide-react";
import { GOV_ALERTS, DISTRICT_TRUST, VISIT_GROWTH } from "../data.js";
import { trustColor } from "./ui.jsx";

const ALERT_COLOR = { red: "#C4472A", yellow: "#D6A61A", green: "#2E9E5B" };

export default function GovDash({ t }) {
  return (
    <main className="safe-x py-10 text-[#E8EEF3]" style={{ background: "#0B1220" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2"><ShieldAlert size={20} color="#9FE3D8" /><h1 className="font-display font-bold text-[26px]">{t.govDash}</h1></div>
        <div className="text-[13px] mt-1" style={{ color: "#8CA3B8" }}>Bugungi monitoring</div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
          {[["1 284", "monitoringdagi maskanlar"], ["436", "yangi sharhlar"], ["74", "shubhali sharhlar"], ["12", "kritik obyektlar"], ["8 420", "verified visits"]].map(([v, l]) => (
            <div key={l} className="rounded-2xl p-[18px]" style={{ background: "#141F30", border: "1px solid #223047" }}>
              <div className="font-mono font-bold text-[22px]" style={{ color: "#9FE3D8" }}>{v}</div>
              <div className="text-xs mt-1" style={{ color: "#8CA3B8" }}>{l}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          <div className="rounded-2xl p-5" style={{ background: "#141F30", border: "1px solid #223047" }}>
            <div className="font-display font-bold mb-3 flex items-center gap-1.5"><BarChart3 size={16} color="#9FE3D8" />Trust Score by district</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={DISTRICT_TRUST}>
                <CartesianGrid strokeDasharray="3 3" stroke="#223047" />
                <XAxis dataKey="district" tick={{ fill: "#8CA3B8", fontSize: 10 }} interval={0} angle={-30} textAnchor="end" height={60} />
                <YAxis tick={{ fill: "#8CA3B8", fontSize: 10 }} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: "#0B1220", border: "1px solid #223047" }} />
                <Bar dataKey="trust" radius={[6, 6, 0, 0]}>
                  {DISTRICT_TRUST.map((d, i) => <Cell key={i} fill={trustColor(d.trust)} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl p-5" style={{ background: "#141F30", border: "1px solid #223047" }}>
            <div className="font-display font-bold mb-3 flex items-center gap-1.5"><TrendingUp size={16} color="#9FE3D8" />Verified Visit growth</div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={VISIT_GROWTH}>
                <CartesianGrid strokeDasharray="3 3" stroke="#223047" />
                <XAxis dataKey="m" tick={{ fill: "#8CA3B8", fontSize: 11 }} />
                <YAxis tick={{ fill: "#8CA3B8", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "#0B1220", border: "1px solid #223047" }} />
                <Line type="monotone" dataKey="v" stroke="#9FE3D8" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl p-5 mt-6" style={{ background: "#141F30", border: "1px solid #223047" }}>
          <div className="font-display font-bold mb-3">AI alerts</div>
          <div className="flex flex-col gap-3">
            {GOV_ALERTS.map((a, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl p-3" style={{ background: "#0B1220", border: `1px solid ${ALERT_COLOR[a.level]}44` }}>
                <span className="rounded-full mt-1.5 flex-shrink-0" style={{ width: 9, height: 9, background: ALERT_COLOR[a.level] }} />
                <span className="text-[13.5px]" style={{ color: "#C5D3E0" }}>{a.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-5 mt-6" style={{ background: "#141F30", border: "1px solid #223047" }}>
          <div className="font-display font-bold mb-1.5">Fraud / manipulation example</div>
          <div className="text-[13.5px]" style={{ color: "#C5D3E0" }}>"Bir obyektga 20 daqiqa ichida 37 ta 5 yulduzli sharh kelib tushdi."</div>
          <div className="flex items-center gap-2 mt-3 font-bold" style={{ color: "#D6A61A" }}><AlertTriangle size={16} /> Manipulyatsiya ehtimoli yuqori</div>
          <div className="text-xs mt-1" style={{ color: "#8CA3B8" }}>Reviews are not deleted immediately — flagged for further verification.</div>
        </div>
      </div>
    </main>
  );
}
