import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Download, Search, CheckCircle, AlertTriangle, FileText } from "lucide-react";
import Navigation from "@/components/Navigation";

const Results = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - in a real app, this would come from your backend
  const matchedRecords = [
    {
      id: 1,
      companyRef: "TXN001",
      partyRef: "PAY001", 
      amount: 15000.00,
      date: "2024-01-15",
      status: "matched",
      confidence: 100
    },
    {
      id: 2,
      companyRef: "TXN002",
      partyRef: "PAY002",
      amount: 8500.50,
      date: "2024-01-16", 
      status: "matched",
      confidence: 95
    },
    {
      id: 3,
      companyRef: "TXN003",
      partyRef: "PAY003",
      amount: 12000.00,
      date: "2024-01-17",
      status: "potential",
      confidence: 78
    },
    {
      id: 4,
      companyRef: "TXN004",
      partyRef: "-",
      amount: 3200.00,
      date: "2024-01-18",
      status: "unmatched",
      confidence: 0
    },
    {
      id: 5,
      companyRef: "TXN005", 
      partyRef: "PAY005",
      amount: 25000.00,
      date: "2024-01-19",
      status: "matched",
      confidence: 100
    }
  ];

  const filteredRecords = matchedRecords.filter(record =>
    record.companyRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.partyRef.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string, confidence: number) => {
    switch (status) {
      case "matched":
        return <Badge className="bg-finance-success/20 text-finance-success border-finance-success/30">
          <CheckCircle className="w-3 h-3 mr-1" />
          Matched ({confidence}%)
        </Badge>;
      case "potential":
        return <Badge className="bg-finance-warning/20 text-finance-warning border-finance-warning/30">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Potential ({confidence}%)
        </Badge>;
      case "unmatched":
        return <Badge variant="destructive">
          Unmatched
        </Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const stats = {
    total: matchedRecords.length,
    matched: matchedRecords.filter(r => r.status === "matched").length,
    potential: matchedRecords.filter(r => r.status === "potential").length,
    unmatched: matchedRecords.filter(r => r.status === "unmatched").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">Reconciliation Results</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Review your matched transactions and download the results for further analysis.
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Matched</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-finance-success">{stats.matched}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Potential Matches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-finance-warning">{stats.potential}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Unmatched</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{stats.unmatched}</div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Actions */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Transaction Matches</CardTitle>
                  <CardDescription>
                    Review and manage your reconciled transaction data
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                    <Input
                      placeholder="Search transactions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-60"
                    />
                  </div>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company Ref</TableHead>
                    <TableHead>Party Ref</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.companyRef}</TableCell>
                      <TableCell>{record.partyRef}</TableCell>
                      <TableCell>${record.amount.toLocaleString()}</TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{getStatusBadge(record.status, record.confidence)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="lg">
              <FileText className="w-5 h-5 mr-2" />
              Generate Report
            </Button>
            <Button size="lg">
              <Download className="w-5 h-5 mr-2" />
              Download Results
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Results;