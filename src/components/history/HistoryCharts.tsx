
import { useState } from "react";
import { HistoryEntry, TaskCategory } from "@/contexts/ChecklistContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { format, subDays, isAfter, isBefore, parseISO } from "date-fns";

interface HistoryChartsProps {
  entries: HistoryEntry[];
}

type TimeRange = "7days" | "14days" | "30days" | "90days" | "all";

const HistoryCharts = ({ entries }: HistoryChartsProps) => {
  const [timeRange, setTimeRange] = useState<TimeRange>("30days");
  
  if (entries.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/10">
        <p className="text-muted-foreground mb-4">No data available for charts</p>
      </div>
    );
  }
  
  // Filter entries based on selected time range
  const filteredEntries = filterEntriesByTimeRange(entries, timeRange);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select
          value={timeRange}
          onValueChange={(value) => setTimeRange(value as TimeRange)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="14days">Last 14 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Task Completion</TabsTrigger>
          <TabsTrigger value="mood">Mood Trends</TabsTrigger>
          <TabsTrigger value="patterns">Weekly Patterns</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MoodProductivityChart entries={filteredEntries} />
            <TaskCompletionOverview entries={filteredEntries} />
            <WeekdayPerformance entries={filteredEntries} />
            <TopTasksCompletion entries={filteredEntries} />
          </div>
        </TabsContent>
        
        <TabsContent value="tasks" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TaskCategoryCompletion entries={filteredEntries} />
            <TaskStreakAnalysis entries={filteredEntries} />
            <CategoryComparisonChart entries={filteredEntries} />
            <TaskCompletionRate entries={filteredEntries} />
          </div>
        </TabsContent>
        
        <TabsContent value="mood" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MoodDistributionChart entries={filteredEntries} />
            <ProductivityDistributionChart entries={filteredEntries} />
            <MoodProductivityCorrelation entries={filteredEntries} />
            <MoodByDayOfWeek entries={filteredEntries} />
          </div>
        </TabsContent>
        
        <TabsContent value="patterns" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <WeeklyActivityHeatmap entries={filteredEntries} />
            <CompletionTrendChart entries={filteredEntries} />
            <WeekdayProductivityChart entries={filteredEntries} />
            <TaskCategoryByWeekday entries={filteredEntries} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper functions and chart components
const filterEntriesByTimeRange = (entries: HistoryEntry[], range: TimeRange): HistoryEntry[] => {
  if (range === "all") return [...entries];
  
  const now = new Date();
  let cutoffDate: Date;
  
  switch (range) {
    case "7days":
      cutoffDate = subDays(now, 7);
      break;
    case "14days":
      cutoffDate = subDays(now, 14);
      break;
    case "30days":
      cutoffDate = subDays(now, 30);
      break;
    case "90days":
      cutoffDate = subDays(now, 90);
      break;
    default:
      cutoffDate = subDays(now, 30);
  }
  
  return entries.filter(entry => {
    const entryDate = new Date(entry.date);
    return isAfter(entryDate, cutoffDate) || entryDate.getTime() === cutoffDate.getTime();
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

const prepareTimeSeriesData = (entries: HistoryEntry[]) => {
  return entries.map(entry => ({
    date: format(new Date(entry.date), 'MM/dd/yyyy'),
    mood: entry.mood,
    productivity: entry.productivity,
    protocol: calculateCompletionPercentage(entry.tasks.filter(t => t.category === 'protocol')),
    main: calculateCompletionPercentage(entry.tasks.filter(t => t.category === 'main')),
    outreach: calculateCompletionPercentage(entry.tasks.filter(t => t.category === 'outreach')),
    overall: calculateCompletionPercentage(entry.tasks)
  }));
};

const calculateCompletionPercentage = (tasks: any[]) => {
  if (tasks.length === 0) return 0;
  const completed = tasks.filter(t => t.isCompleted).length;
  return Math.round((completed / tasks.length) * 100);
};

// Individual chart components
const MoodProductivityChart = ({ entries }: { entries: HistoryEntry[] }) => {
  const data = prepareTimeSeriesData(entries);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mood & Productivity Trends</CardTitle>
        <CardDescription>Your daily mood and productivity scores over time</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ChartContainer
          config={{
            mood: { color: "#22c55e" },
            productivity: { color: "#3b82f6" },
          }}
        >
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 10]} />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="mood" 
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="productivity" 
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

const TaskCompletionOverview = ({ entries }: { entries: HistoryEntry[] }) => {
  const data = prepareTimeSeriesData(entries);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Completion Overview</CardTitle>
        <CardDescription>Percentage of tasks completed by category</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ChartContainer
          config={{
            protocol: { color: "#ec4899" },
            main: { color: "#f97316" },
            outreach: { color: "#8b5cf6" },
          }}
        >
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="protocol" 
              stackId="1" 
              stroke="#ec4899" 
              fill="#ec4899" 
            />
            <Area 
              type="monotone" 
              dataKey="main" 
              stackId="2" 
              stroke="#f97316" 
              fill="#f97316" 
            />
            <Area 
              type="monotone" 
              dataKey="outreach" 
              stackId="3" 
              stroke="#8b5cf6" 
              fill="#8b5cf6" 
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

const WeekdayPerformance = ({ entries }: { entries: HistoryEntry[] }) => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  const weekdayData = days.map(day => {
    const dayEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return days[entryDate.getDay()] === day;
    });
    
    if (dayEntries.length === 0) {
      return { name: day, tasks: 0, mood: 0, productivity: 0 };
    }
    
    const avgMood = dayEntries.reduce((sum, entry) => sum + entry.mood, 0) / dayEntries.length;
    const avgProductivity = dayEntries.reduce((sum, entry) => sum + entry.productivity, 0) / dayEntries.length;
    
    const totalTaskCompletion = dayEntries.reduce((sum, entry) => {
      const completedTasks = entry.tasks.filter(t => t.isCompleted).length;
      const totalTasks = entry.tasks.length;
      return sum + (completedTasks / totalTasks) * 100;
    }, 0);
    
    return {
      name: day.substring(0, 3),
      tasks: Math.round(totalTaskCompletion / dayEntries.length),
      mood: Math.round(avgMood * 10) / 10,
      productivity: Math.round(avgProductivity * 10) / 10
    };
  });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekday Performance</CardTitle>
        <CardDescription>Your average mood, productivity, and task completion by day of week</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ChartContainer
          config={{
            tasks: { color: "#f97316" },
            mood: { color: "#22c55e" },
            productivity: { color: "#3b82f6" },
          }}
        >
          <BarChart data={weekdayData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend />
            <Bar dataKey="tasks" name="Tasks %" fill="#f97316" />
            <Bar dataKey="mood" name="Mood" fill="#22c55e" />
            <Bar dataKey="productivity" name="Productivity" fill="#3b82f6" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

const TopTasksCompletion = ({ entries }: { entries: HistoryEntry[] }) => {
  // Prepare data for top tasks completion rate
  const taskCompletionMap = new Map<string, { completed: number, total: number }>();
  
  entries.forEach(entry => {
    entry.tasks.forEach(task => {
      if (!taskCompletionMap.has(task.id)) {
        taskCompletionMap.set(task.id, { completed: 0, total: 0 });
      }
      
      const current = taskCompletionMap.get(task.id)!;
      taskCompletionMap.set(task.id, {
        completed: current.completed + (task.isCompleted ? 1 : 0),
        total: current.total + 1
      });
    });
  });
  
  const taskCompletionData = Array.from(taskCompletionMap.entries())
    .map(([id, stats]) => {
      // Find the task name from the last entry that contains this task
      const taskEntry = entries
        .slice()
        .reverse()
        .find(entry => entry.tasks.some(t => t.id === id));
      
      const taskName = taskEntry?.tasks.find(t => t.id === id)?.label || id;
      
      return {
        name: taskName,
        rate: Math.round((stats.completed / stats.total) * 100)
      };
    })
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 5); // Get top 5
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Tasks Completion Rate</CardTitle>
        <CardDescription>Your most consistently completed tasks</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={taskCompletionData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, rate }) => `${name}: ${rate}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="rate"
            >
              {taskCompletionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Placeholder components for the remaining charts (these would be implemented similarly)
const TaskCategoryCompletion = ({ entries }: { entries: HistoryEntry[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Category Completion</CardTitle>
        <CardDescription>Completion rate for each task category</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground">More detailed chart coming soon</p>
      </CardContent>
    </Card>
  );
};

const TaskStreakAnalysis = ({ entries }: { entries: HistoryEntry[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Streak Analysis</CardTitle>
        <CardDescription>Your longest streaks for completing tasks</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground">More detailed chart coming soon</p>
      </CardContent>
    </Card>
  );
};

const CategoryComparisonChart = ({ entries }: { entries: HistoryEntry[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Comparison</CardTitle>
        <CardDescription>Compare completion rates across categories</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground">More detailed chart coming soon</p>
      </CardContent>
    </Card>
  );
};

const TaskCompletionRate = ({ entries }: { entries: HistoryEntry[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Completion Rate</CardTitle>
        <CardDescription>How often you complete each task</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground">More detailed chart coming soon</p>
      </CardContent>
    </Card>
  );
};

const MoodDistributionChart = ({ entries }: { entries: HistoryEntry[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mood Distribution</CardTitle>
        <CardDescription>Distribution of your mood scores</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground">More detailed chart coming soon</p>
      </CardContent>
    </Card>
  );
};

const ProductivityDistributionChart = ({ entries }: { entries: HistoryEntry[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Productivity Distribution</CardTitle>
        <CardDescription>Distribution of your productivity scores</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground">More detailed chart coming soon</p>
      </CardContent>
    </Card>
  );
};

const MoodProductivityCorrelation = ({ entries }: { entries: HistoryEntry[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mood-Productivity Correlation</CardTitle>
        <CardDescription>How mood and productivity relate to each other</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground">More detailed chart coming soon</p>
      </CardContent>
    </Card>
  );
};

const MoodByDayOfWeek = ({ entries }: { entries: HistoryEntry[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mood by Day of Week</CardTitle>
        <CardDescription>Your mood patterns across different days</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground">More detailed chart coming soon</p>
      </CardContent>
    </Card>
  );
};

const WeeklyActivityHeatmap = ({ entries }: { entries: HistoryEntry[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Activity Heatmap</CardTitle>
        <CardDescription>Your activity patterns throughout the week</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground">More detailed chart coming soon</p>
      </CardContent>
    </Card>
  );
};

const CompletionTrendChart = ({ entries }: { entries: HistoryEntry[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Completion Trend</CardTitle>
        <CardDescription>Your task completion trend over time</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground">More detailed chart coming soon</p>
      </CardContent>
    </Card>
  );
};

const WeekdayProductivityChart = ({ entries }: { entries: HistoryEntry[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekday Productivity</CardTitle>
        <CardDescription>Your productivity patterns by day of week</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground">More detailed chart coming soon</p>
      </CardContent>
    </Card>
  );
};

const TaskCategoryByWeekday = ({ entries }: { entries: HistoryEntry[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Category by Weekday</CardTitle>
        <CardDescription>Which categories you complete on different days</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground">More detailed chart coming soon</p>
      </CardContent>
    </Card>
  );
};

export default HistoryCharts;
