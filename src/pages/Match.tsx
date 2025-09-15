import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";

// Mock data - in real app this would come from uploaded files
const companyData = [
  { id: 1, date: "2024-01-15", amount: 1500.00, reference: "PAY001", description: "Payment to Supplier A" },
  { id: 2, date: "2024-01-16", amount: 2300.50, reference: "PAY002", description: "Office Rent Payment" },
  { id: 3, date: "2024-01-17", amount: 890.75, reference: "PAY003", description: "Utility Bill Payment" },
  { id: 4, date: "2024-01-18", amount: 1200.00, reference: "PAY004", description: "Marketing Services" },
  { id: 5, date: "2024-01-19", amount: 3500.25, reference: "PAY005", description: "Equipment Purchase" },
];

const partyData = [
  { id: 1, date: "2024-01-15", amount: 1500.00, reference: "REC001", description: "Payment Received from Client" },
  { id: 2, date: "2024-01-16", amount: 2300.50, reference: "REC002", description: "Rent Payment Received" },
  { id: 3, date: "2024-01-17", amount: 890.75, reference: "REC003", description: "Utility Payment Received" },
  { id: 4, date: "2024-01-20", amount: 750.00, reference: "REC004", description: "Service Payment" },
  { id: 5, date: "2024-01-21", amount: 3500.25, reference: "REC005", description: "Equipment Payment Received" },
];

type Match = {
  companyId: number;
  partyId: number;
};

const Match = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const [selectedParty, setSelectedParty] = useState<number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleMatch = () => {
    if (selectedCompany && selectedParty) {
      // Check if either record is already matched
      const existingMatch = matches.find(
        m => m.companyId === selectedCompany || m.partyId === selectedParty
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
      
      toast({
        title: "Match Created",
        description: "Records have been successfully matched.",
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

    // Transform matches into the format expected by Results page
    const matchedRecords = matches.map((match, index) => {
      const companyRecord = companyData.find(r => r.id === match.companyId);
      const partyRecord = partyData.find(r => r.id === match.partyId);
      return {
        id: index + 1,
        companyRef: companyRecord?.reference || "",
        partyRef: partyRecord?.reference || "",
        amount: companyRecord?.amount || 0,
        date: companyRecord?.date || "",
        status: "matched" as const,
        confidence: 100
      };
    });

    // Add unmatched company records
    const unmatchedCompanyRecords = companyData
      .filter(record => !matches.some(m => m.companyId === record.id))
      .map((record, index) => ({
        id: matchedRecords.length + index + 1,
        companyRef: record.reference,
        partyRef: "-",
        amount: record.amount,
        date: record.date,
        status: "unmatched" as const,
        confidence: 0
      }));

    const allRecords = [...matchedRecords, ...unmatchedCompanyRecords];

    toast({
      title: "Matching Complete",
      description: "Redirecting to results...",
    });

    setTimeout(() => {
      navigate("/results", { state: { matchedRecords: allRecords } });
    }, 1000);
  };

  const isRecordMatched = (type: 'company' | 'party', id: number) => {
    return matches.some(m => 
      type === 'company' ? m.companyId === id : m.partyId === id
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
              Review your data and manually match corresponding records between company and party datasets.
            </p>
          </div>

          {/* Progress Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-finance-primary">{companyData.length}</div>
                <div className="text-sm text-muted-foreground">Company Records</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-accent">{partyData.length}</div>
                <div className="text-sm text-muted-foreground">Party Records</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-finance-success">{matches.length}</div>
                <div className="text-sm text-muted-foreground">Matches Created</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-muted-foreground">
                  {Math.max(companyData.length, partyData.length) - matches.length}
                </div>
                <div className="text-sm text-muted-foreground">Unmatched</div>
              </CardContent>
            </Card>
          </div>

          {/* Matching Interface */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Company Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-finance-primary rounded-full"></div>
                  Company Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                {companyData.map((record) => (
                  <div
                    key={record.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      isRecordMatched('company', record.id)
                        ? 'bg-finance-success/10 border-finance-success/30'
                        : selectedCompany === record.id
                        ? 'bg-finance-primary/10 border-finance-primary'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => !isRecordMatched('company', record.id) && setSelectedCompany(record.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{record.reference}</span>
                          {isRecordMatched('company', record.id) && (
                            <Badge variant="secondary" className="bg-finance-success/20 text-finance-success">
                              <Check className="w-3 h-3 mr-1" />
                              Matched
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">{record.date}</div>
                        <div className="text-sm">{record.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-finance-primary">
                          ${record.amount.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Party Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-accent rounded-full"></div>
                  Party Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                {partyData.map((record) => (
                  <div
                    key={record.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      isRecordMatched('party', record.id)
                        ? 'bg-finance-success/10 border-finance-success/30'
                        : selectedParty === record.id
                        ? 'bg-accent/10 border-accent'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => !isRecordMatched('party', record.id) && setSelectedParty(record.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{record.reference}</span>
                          {isRecordMatched('party', record.id) && (
                            <Badge variant="secondary" className="bg-finance-success/20 text-finance-success">
                              <Check className="w-3 h-3 mr-1" />
                              Matched
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">{record.date}</div>
                        <div className="text-sm">{record.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-accent">
                          ${record.amount.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Match Controls */}
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={handleMatch}
                disabled={!selectedCompany || !selectedParty}
                className="px-6"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Create Match
              </Button>
            </div>

            {selectedCompany && selectedParty && (
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Selected: Company Record #{selectedCompany} ↔ Party Record #{selectedParty}
                </p>
              </div>
            )}
          </div>

          {/* Matched Pairs Preview */}
          {matches.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Matched Pairs ({matches.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {matches.map((match, index) => {
                    const companyRecord = companyData.find(r => r.id === match.companyId);
                    const partyRecord = partyData.find(r => r.id === match.partyId);
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-finance-success/5 rounded-lg border border-finance-success/20">
                        <div className="text-sm">
                          <span className="font-medium">{companyRecord?.reference}</span> ↔ 
                          <span className="font-medium ml-1">{partyRecord?.reference}</span>
                        </div>
                        <div className="text-sm font-medium text-finance-success">
                          ${companyRecord?.amount.toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Done Button */}
          <div className="text-center">
            <Button 
              onClick={handleDone}
              size="lg" 
              className="px-8 py-6 text-lg"
              disabled={matches.length === 0}
            >
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