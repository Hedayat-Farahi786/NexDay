
import { useState } from "react";
import { useChecklist, HistoryEntry } from "@/contexts/ChecklistContext";
import HistoryList from "@/components/history/HistoryList";
import HistoryDetail from "@/components/history/HistoryDetail";
import HistoryCharts from "@/components/history/HistoryCharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, List, BarChart } from "lucide-react";

const History = () => {
  const { getHistory } = useChecklist();
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "charts">("list");
  
  const historyEntries = getHistory();
  
  const selectedEntry = selectedEntryId 
    ? historyEntries.find(entry => entry.id === selectedEntryId) || null
    : null;
  
  const handleBackToList = () => {
    setSelectedEntryId(null);
  };
  
  const handleEntrySelect = (entryId: string) => {
    setSelectedEntryId(entryId);
  };

  return (
    <main className="container py-6 px-4 md:py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {selectedEntry && (
            <Button variant="ghost" size="icon" onClick={handleBackToList} className="mr-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <h1 className="text-2xl font-bold">
            {selectedEntry 
              ? new Date(selectedEntry.date).toLocaleDateString(undefined, { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })
              : "History & Analytics"
            }
          </h1>
        </div>
        
        {!selectedEntry && (
          <Tabs value={view} onValueChange={(v) => setView(v as "list" | "charts")}>
            <TabsList>
              <TabsTrigger value="list">
                <List className="w-4 h-4 mr-2" />
                List
              </TabsTrigger>
              <TabsTrigger value="charts">
                <BarChart className="w-4 h-4 mr-2" />
                Charts
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </div>
      
      {selectedEntry ? (
        <HistoryDetail entry={selectedEntry} />
      ) : (
        <>
          {view === "list" && (
            <HistoryList entries={historyEntries} onEntrySelect={handleEntrySelect} />
          )}
          {view === "charts" && (
            <HistoryCharts entries={historyEntries} />
          )}
        </>
      )}
    </main>
  );
};

export default History;
