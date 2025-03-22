
import { useState } from "react";
import { useChecklist, HistoryEntry } from "@/contexts/ChecklistContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface HistoryListProps {
  entries: HistoryEntry[];
  onEntrySelect: (entryId: string) => void;
}

const HistoryList = ({ entries, onEntrySelect }: HistoryListProps) => {
  const { deleteHistoryEntry } = useChecklist();
  const [searchTerm, setSearchTerm] = useState("");
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
  
  // Sort entries by date (newest first)
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Filter entries based on search term
  const filteredEntries = sortedEntries.filter(entry => {
    const date = new Date(entry.date).toLocaleDateString();
    const lessons = entry.lesson.toLowerCase();
    const gratitudes = entry.gratitudes.join(" ").toLowerCase();
    
    return (
      date.includes(searchTerm.toLowerCase()) ||
      lessons.includes(searchTerm.toLowerCase()) ||
      gratitudes.includes(searchTerm.toLowerCase())
    );
  });
  
  const handleDeleteClick = (entryId: string) => {
    setEntryToDelete(entryId);
  };
  
  const confirmDelete = () => {
    if (entryToDelete) {
      deleteHistoryEntry(entryToDelete);
      setEntryToDelete(null);
    }
  };
  
  const cancelDelete = () => {
    setEntryToDelete(null);
  };
  
  if (entries.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/10">
        <p className="text-muted-foreground mb-4">No history entries found</p>
        <Button variant="secondary" onClick={() => window.location.href = "/"}>
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search by date, lesson, or gratitude..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Mood</TableHead>
              <TableHead>Productivity</TableHead>
              <TableHead>Protocol</TableHead>
              <TableHead>Main</TableHead>
              <TableHead>Outreach</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry) => {
                const date = new Date(entry.date);
                const protocolTasks = entry.tasks.filter(t => t.category === 'protocol');
                const mainTasks = entry.tasks.filter(t => t.category === 'main');
                const outreachTasks = entry.tasks.filter(t => t.category === 'outreach');
                
                const getProgress = (tasks: typeof entry.tasks) => {
                  const completed = tasks.filter(t => t.isCompleted).length;
                  const total = tasks.length;
                  return { completed, total };
                };
                
                const protocolProgress = getProgress(protocolTasks);
                const mainProgress = getProgress(mainTasks);
                const outreachProgress = getProgress(outreachTasks);
                
                return (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">
                      {date.toLocaleDateString(undefined, { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </TableCell>
                    <TableCell>{entry.mood}/10</TableCell>
                    <TableCell>{entry.productivity}/10</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary"
                            style={{ width: `${(protocolProgress.completed / protocolProgress.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs whitespace-nowrap">
                          {protocolProgress.completed}/{protocolProgress.total}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary"
                            style={{ width: `${(mainProgress.completed / mainProgress.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs whitespace-nowrap">
                          {mainProgress.completed}/{mainProgress.total}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary"
                            style={{ width: `${(outreachProgress.completed / outreachProgress.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs whitespace-nowrap">
                          {outreachProgress.completed}/{outreachProgress.total}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onEntrySelect(entry.id)}
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteClick(entry.id)}
                          title="Delete entry"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                  No matching entries found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <AlertDialog open={entryToDelete !== null} onOpenChange={(open) => !open && setEntryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the selected history entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default HistoryList;
