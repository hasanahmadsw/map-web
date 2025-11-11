import { Users, Briefcase, Award, Globe } from "lucide-react"
import { Translations } from "@/utils/dictionary-utils"
import Image from "next/image"

interface Statistic {
  icon: typeof Users
  value: string
  label: string
}

interface StatisticsSectionProps {
  lang: string
  t: Translations
}

export function StatisticsSection({ lang, t }: StatisticsSectionProps) {
  // Default statistics - you can customize these or fetch from API
  const statistics: Statistic[] = [
    {
      icon: Users,
      value: "1000+",
      label: "Happy Clients",
    },
    {
      icon: Briefcase,
      value: "500+",
      label: "Projects Completed",
    },
    {
      icon: Award,
      value: "50+",
      label: "Awards Won",
    },
    {
      icon: Globe,
      value: "20+",
      label: "Countries Served",
    },
  ]

  return (
    <section className="relative w-full py-16 overflow-hidden">


      {/* Content */}
      <div className="container max-w-7xl relative z-10">
        <div className="glass-card rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statistics.map((stat, index) => {
              const Icon = stat.icon
              const isLastInMobileRow = (index + 1) % 2 === 0
              const isLastInDesktopRow = (index + 1) % 4 === 0
              return (
                <div 
                  key={index} 
                  className={`text-center space-y-2 ${
                    !isLastInMobileRow ? 'border-r border-border/50' : ''
                  } ${
                    !isLastInDesktopRow ? 'md:border-r md:border-border/50' : 'md:border-r-0'
                  }`}
                >
                  <div className="flex justify-center">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-medium">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

