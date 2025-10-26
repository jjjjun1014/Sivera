/* eslint-disable local/no-literal-strings */
"use client";

import { Card, CardBody } from "@heroui/card";
import { motion } from "framer-motion";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
}

const MetricCard = ({ title, value, change, changeLabel }: MetricCardProps) => {
  const isPositive = change >= 0;

  return (
    <Card className="bg-white/80 dark:bg-default-100/80 backdrop-blur">
      <CardBody className="gap-2">
        <p className="text-sm text-default-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        <div className="flex items-center gap-1">
          {isPositive ? (
            <FaArrowUp className="w-3 h-3 text-success" />
          ) : (
            <FaArrowDown className="w-3 h-3 text-danger" />
          )}
          <span
            className={`text-sm ${isPositive ? "text-success" : "text-danger"}`}
          >
            {Math.abs(change)}%
          </span>
          <span className="text-xs text-default-400">{changeLabel}</span>
        </div>
      </CardBody>
    </Card>
  );
};

export const DashboardPreview = () => {
  const metrics = [
    {
      title: "총 광고비",
      value: "₩12,450,000",
      change: -5.2,
      changeLabel: "전월 대비",
    },
    {
      title: "총 클릭수",
      value: "145.2K",
      change: 12.5,
      changeLabel: "전월 대비",
    },
    {
      title: "평균 CPC",
      value: "₩1,230",
      change: -8.7,
      changeLabel: "전월 대비",
    },
    {
      title: "ROAS",
      value: "487%",
      change: 23.4,
      changeLabel: "전월 대비",
    },
  ];

  const platforms = [
    { name: "Google Ads", spend: "₩5,200,000", roas: "520%", color: "bg-blue-500" },
    { name: "Meta Ads", spend: "₩4,100,000", roas: "412%", color: "bg-indigo-500" },
    { name: "TikTok Ads", spend: "₩2,150,000", roas: "680%", color: "bg-pink-500" },
    { name: "Amazon Ads", spend: "₩1,000,000", roas: "340%", color: "bg-orange-500" },
  ];

  const features = [
    { icon: "📊", title: "통합 대시보드", desc: "모든 플랫폼 성과를 한눈에" },
    { icon: "🤖", title: "AI 이상 탐지", desc: "광고 성과 이상 패턴 자동 감지" },
    { icon: "⚡", title: "실시간 동기화", desc: "24/7 데이터 자동 업데이트" },
    { icon: "📈", title: "고급 분석", desc: "플랫폼별 비교 분석 및 리포트" },
    { icon: "🎯", title: "자동 최적화", desc: "AI 기반 입찰 및 예산 추천" },
    { icon: "👥", title: "팀 협업", desc: "권한별 접근 제어 및 공유" },
  ];

  return (
    <div className="relative">
      {/* Mock dashboard background */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-secondary/5 rounded-xl" />

      {/* Dashboard content */}
      <div className="relative p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">광고 성과 개요</h3>
          <p className="text-sm text-default-500">2025년 1월 성과 리포트</p>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <MetricCard {...metric} />
            </motion.div>
          ))}
        </div>

        {/* Platform Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <Card className="bg-white/80 dark:bg-default-100/80 backdrop-blur">
            <CardBody>
              <h4 className="text-lg font-semibold mb-4">플랫폼별 광고비</h4>
              <div className="space-y-4">
                {platforms.map((platform, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{platform.name}</span>
                      <span className="text-default-600">{platform.spend}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-default-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${platform.color} rounded-full`}
                          style={{ width: `${(parseInt(platform.spend.replace(/[^0-9]/g, '')) / 12450000) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-success font-semibold min-w-[60px] text-right">
                        ROAS {platform.roas}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
          <Card className="bg-white/80 dark:bg-default-100/80 backdrop-blur">
            <CardBody>
              <h4 className="text-lg font-semibold mb-4">주요 기능</h4>
              <div className="grid grid-cols-2 gap-3">
                {features.map((feature, index) => (
                  <div key={index} className="p-3 bg-default-50 dark:bg-default-100 rounded-lg">
                    <div className="text-2xl mb-2">{feature.icon}</div>
                    <div className="text-sm font-semibold mb-1">{feature.title}</div>
                    <div className="text-xs text-default-500">{feature.desc}</div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
