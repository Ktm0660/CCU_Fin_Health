import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
export default function HealthRadar({ data }: { data: {subject:string; value:number}[] }) {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 40]} />
          <Tooltip />
          <Radar name="Score" dataKey="value" fill="#299a7f" fillOpacity={0.4} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
