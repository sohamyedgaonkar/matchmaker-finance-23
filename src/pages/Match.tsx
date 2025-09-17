import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";

type RecordType = {
  id: number;
  date?: string;
  amount?: number;
  reference?: string;
  description?: string;
  [key: string]: any;
};

type Match = {
  companyIds: number[];
  partyIds: number[];
};

const Match = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const companyDataRaw: any[] = location.state?.companyData || [];
  const partyDataRaw: any[] = location.state?.partyData || [];

  // Normalize records: assign IDs if not present
  const companyData: RecordType[] = companyDataRaw.map((rec, i) => ({
  id: i + 1,
  reference: rec.invoiceNumber || rec.reference || `C-${i + 1}`,
  date: rec.invoiceDate || rec.date || "",
  dateText: rec.invoiceDateText || "",
  amount: Number(rec.amount || rec.Amount || 0),
  description: rec.description || "",
  docType: rec.docType || "",
}));

  const partyData: RecordType[] = partyDataRaw.map((rec, i) => ({
  id: i + 1,
  reference: rec.invoiceNumber || rec.reference || `P-${i + 1}`,
  date: rec.invoiceDate || rec.date || "",
  dateText: rec.invoiceDateText || "",
  amount: Number(rec.amount || rec.Amount || 0),
  description: rec.description || "",
  docType: rec.docType || "",
}));

  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedCompanyIds, setSelectedCompanyIds] = useState<number[]>([]);
  const [selectedPartyIds, setSelectedPartyIds] = useState<number[]>([]);

  const handleMatch = () => {
    if (selectedCompanyIds.length > 0 && selectedPartyIds.length > 0) {
      // Check if any selected records are already matched
      const conflictingMatches = matches.filter(
        (m) => selectedCompanyIds.some(id => m.companyIds.includes(id)) || 
               selectedPartyIds.some(id => m.partyIds.includes(id))
      );
      
      if (conflictingMatches.length > 0) {
        toast({
          title: "Already Matched",
          description: "Some of the selected records are already matched.",
          variant: "destructive",
        });
        return;
      }

      // Create a single grouped match with all selected records
      const newMatch: Match = {
        companyIds: [...selectedCompanyIds],
        partyIds: [...selectedPartyIds],
      };

      setMatches([...matches, newMatch]);
      setSelectedCompanyIds([]);
      setSelectedPartyIds([]);
      
      toast({ 
        title: "Match Created", 
        description: `Grouped ${selectedCompanyIds.length} company record${selectedCompanyIds.length > 1 ? 's' : ''} with ${selectedPartyIds.length} party record${selectedPartyIds.length > 1 ? 's' : ''}.` 
      });
    }
  };

  const handleDone = () => {
    if (matches.length === 0) {
      toast({
        title: "No Matches",
        description: "Please create at least one match before proceeding.",
        variant: "destructive",
      });
      return;
    }

    const matchedRecords = matches.map((match, index) => {
      const companyRecords = companyData.filter((r) => match.companyIds.includes(r.id));
      const partyRecords = partyData.filter((r) => match.partyIds.includes(r.id));
      
      return {
        id: index + 1,
        companyRefs: companyRecords.map(r => r.reference),
        partyRefs: partyRecords.map(r => r.reference),
        amount: companyRecords.reduce((sum, r) => sum + (r.amount || 0), 0),
        date: companyRecords[0]?.date || "",
        status: "matched" as const,
        confidence: 100,
      };
    });

    const unmatchedCompanyRecords = companyData
      .filter((r) => !matches.some((m) => m.companyIds.includes(r.id)))
      .map((record, idx) => ({
        id: matchedRecords.length + idx + 1,
        companyRefs: [record.reference],
        partyRefs: ["-"],
        amount: record.amount,
        date: record.date,
        status: "unmatched" as const,
        confidence: 0,
      }));

    const allRecords = [...matchedRecords, ...unmatchedCompanyRecords];

    toast({ title: "Matching Complete", description: "Redirecting to results..." });

    setTimeout(() => {
      navigate("/results", { state: { matchedRecords: allRecords } });
    }, 1000);
  };

  const isRecordMatched = (type: "company" | "party", id: number) => {
    return matches.some((m) => 
      type === "company" 
        ? m.companyIds.includes(id) 
        : m.partyIds.includes(id)
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">Manual Reconciliation</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Review your data and manually match corresponding records between company and party datasets. Click to select multiple records on each side, then create matches.
            </p>
          </div>

          {/* Progress Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card><CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-finance-primary">{companyData.length}</div>
              <div className="text-sm text-muted-foreground">Company Records</div>
            </CardContent></Card>
            <Card><CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-accent">{partyData.length}</div>
              <div className="text-sm text-muted-foreground">Party Records</div>
            </CardContent></Card>
            <Card><CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-finance-success">{matches.length}</div>
              <div className="text-sm text-muted-foreground">Matches Created</div>
            </CardContent></Card>
            <Card><CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-muted-foreground">
                {Math.max(companyData.length, partyData.length) - matches.length}
              </div>
              <div className="text-sm text-muted-foreground">Unmatched</div>
            </CardContent></Card>
          </div>

          {/* Matching UI */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Company List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  Company Data
                  {selectedCompanyIds.length > 0 && (
                    <Badge variant="secondary">{selectedCompanyIds.length} selected</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                {companyData.map((record) => (
                  <div
                    key={record.id}
                    className={`p-4 border rounded-lg cursor-pointer ${
                      isRecordMatched("company", record.id)
                        ? "bg-finance-success/10 border-finance-success"
                        : selectedCompanyIds.includes(record.id)
                        ? "bg-finance-primary/10 border-finance-primary"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => {
                      if (!isRecordMatched("company", record.id)) {
                        setSelectedCompanyIds(prev => 
                          prev.includes(record.id) 
                            ? prev.filter(id => id !== record.id)
                            : [...prev, record.id]
                        );
                      }
                    }}
                  >
                    <div className="flex justify-between">
                      <div>
                        <span className="font-medium">{record.reference}</span>
                        <div className="text-sm text-muted-foreground">{record.date} ({record.dateText})</div>
                        <div className="text-sm">{record.docType}</div>
                      </div>
                      <div className="font-bold text-finance-primary">${record.amount?.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Party List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  Party Data
                  {selectedPartyIds.length > 0 && (
                    <Badge variant="secondary">{selectedPartyIds.length} selected</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                {partyData.map((record) => (
                  <div
                    key={record.id}
                    className={`p-4 border rounded-lg cursor-pointer ${
                      isRecordMatched("party", record.id)
                        ? "bg-finance-success/10 border-finance-success"
                        : selectedPartyIds.includes(record.id)
                        ? "bg-accent/10 border-accent"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => {
                      if (!isRecordMatched("party", record.id)) {
                        setSelectedPartyIds(prev => 
                          prev.includes(record.id) 
                            ? prev.filter(id => id !== record.id)
                            : [...prev, record.id]
                        );
                      }
                    }}
                  >
                    <div className="flex justify-between">
                      <div>
                        <span className="font-medium">{record.reference}</span>
                        <div className="text-sm text-muted-foreground">{record.date}</div>
                        <div className="text-sm">{record.description}</div>
                      </div>
                      <div className="font-bold text-accent">${record.amount?.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Match Controls */}
          <div className="text-center">
            <Button onClick={handleMatch} disabled={selectedCompanyIds.length === 0 || selectedPartyIds.length === 0}>
              <ArrowRight className="w-4 h-4 mr-2" />
              Create Match
            </Button>
          </div>

          {/* Done */}
          <div className="text-center">
            <Button onClick={handleDone} size="lg" disabled={matches.length === 0}>
              <Check className="w-5 h-5 mr-2" />
              Done - View Results
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Match;
