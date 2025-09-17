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
  companyId: number;
  partyId: number;
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
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const [selectedParty, setSelectedParty] = useState<number | null>(null);

  const handleMatch = () => {
    if (selectedCompany && selectedParty) {
      const existingMatch = matches.find(
        (m) => m.companyId === selectedCompany || m.partyId === selectedParty
      );
      if (existingMatch) {
        toast({
          title: "Already Matched",
          description: "One of the selected records is already matched.",
          variant: "destructive",
        });
        return;
      }
      setMatches([...matches, { companyId: selectedCompany, partyId: selectedParty }]);
      setSelectedCompany(null);
      setSelectedParty(null);
      toast({ title: "Match Created", description: "Records have been successfully matched." });
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
      const companyRecord = companyData.find((r) => r.id === match.companyId);
      const partyRecord = partyData.find((r) => r.id === match.partyId);
      return {
        id: index + 1,
        companyRef: companyRecord?.reference || "",
        partyRef: partyRecord?.reference || "",
        amount: companyRecord?.amount || 0,
        date: companyRecord?.date || "",
        status: "matched" as const,
        confidence: 100,
      };
    });

    const unmatchedCompanyRecords = companyData
      .filter((r) => !matches.some((m) => m.companyId === r.id))
      .map((record, idx) => ({
        id: matchedRecords.length + idx + 1,
        companyRef: record.reference,
        partyRef: "-",
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
    return matches.some((m) => (type === "company" ? m.companyId === id : m.partyId === id));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">Manual Reconciliation</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Review your data and manually match corresponding records between company and party datasets.
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
              <CardHeader><CardTitle>Company Data</CardTitle></CardHeader>
              <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                {companyData.map((record) => (
                  <div
                    key={record.id}
                    className={`p-4 border rounded-lg cursor-pointer ${
                      isRecordMatched("company", record.id)
                        ? "bg-finance-success/10"
                        : selectedCompany === record.id
                        ? "bg-finance-primary/10"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => !isRecordMatched("company", record.id) && setSelectedCompany(record.id)}
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
              <CardHeader><CardTitle>Party Data</CardTitle></CardHeader>
              <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                {partyData.map((record) => (
                  <div
                    key={record.id}
                    className={`p-4 border rounded-lg cursor-pointer ${
                      isRecordMatched("party", record.id)
                        ? "bg-finance-success/10"
                        : selectedParty === record.id
                        ? "bg-accent/10"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => !isRecordMatched("party", record.id) && setSelectedParty(record.id)}
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
            <Button onClick={handleMatch} disabled={!selectedCompany || !selectedParty}>
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
