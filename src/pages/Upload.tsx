import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload as UploadIcon, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const [companyFile, setCompanyFile] = useState<File | null>(null);
  const [partyFile, setPartyFile] = useState<File | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Utility to parse CSV/XLSX into JSON
  const parseFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const ext = file.name.split(".").pop()?.toLowerCase();
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = e.target?.result;
        if (!data) return reject("No data");

        if (ext === "csv") {
          Papa.parse(data as string, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => resolve(results.data),
            error: (err) => reject(err),
          });
        } else {
          const wb = XLSX.read(data, { type: "binary" });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json(ws);
          resolve(json);
        }
      };

      if (ext === "csv") reader.readAsText(file);
      else reader.readAsBinaryString(file);
    });
  };

  const handleFileChange = (type: "company" | "party", file: File | null) => {
    if (type === "company") {
      setCompanyFile(file);
    } else {
      setPartyFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!companyFile || !partyFile) {
      toast({
        title: "Missing Files",
        description: "Please upload both Company and Party data files.",
        variant: "destructive",
      });
      return;
    }

    try {
      const [companyData, partyData] = await Promise.all([
        parseFile(companyFile),
        parseFile(partyFile),
      ]);

      toast({
        title: "Files Uploaded Successfully",
        description: "Your files are being processed for reconciliation.",
      });

      setTimeout(() => {
        navigate("/match", { state: { companyData, partyData } });
      }, 1000);
    } catch (err) {
      toast({
        title: "Error Parsing Files",
        description: String(err),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">Upload Your Data</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload your company and party data files to begin the reconciliation process. 
              We support CSV, Excel, and other common data formats.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Company Upload */}
            <Card className="shadow-card">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-finance-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileSpreadsheet className="w-8 h-8 text-finance-primary" />
                </div>
                <CardTitle className="text-2xl">Company Data</CardTitle>
                <CardDescription>
                  Upload your company's financial records
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Label htmlFor="company-file">Select Company File</Label>
                <Input
                  id="company-file"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={(e) => handleFileChange("company", e.target.files?.[0] || null)}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-finance-secondary file:text-finance-primary"
                />
                {companyFile && (
                  <div className="p-3 bg-finance-success/10 rounded-lg border border-finance-success/20">
                    ✓ {companyFile.name} uploaded successfully
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Party Upload */}
            <Card className="shadow-card">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileSpreadsheet className="w-8 h-8 text-accent" />
                </div>
                <CardTitle className="text-2xl">Party Data</CardTitle>
                <CardDescription>
                  Upload counterparty transaction records
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Label htmlFor="party-file">Select Party File</Label>
                <Input
                  id="party-file"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={(e) => handleFileChange("party", e.target.files?.[0] || null)}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-finance-secondary file:text-finance-primary"
                />
                {partyFile && (
                  <div className="p-3 bg-finance-success/10 rounded-lg border border-finance-success/20">
                    ✓ {partyFile.name} uploaded successfully
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Process Button */}
          <div className="text-center">
            <Button 
              onClick={handleSubmit} 
              size="lg" 
              className="px-8 py-6 text-lg"
              disabled={!companyFile || !partyFile}
            >
              <UploadIcon className="w-5 h-5 mr-2" />
              Process Data for Reconciliation
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Upload;
