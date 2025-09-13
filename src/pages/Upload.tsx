import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload as UploadIcon, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";

const Upload = () => {
  const [companyFile, setCompanyFile] = useState<File | null>(null);
  const [partyFile, setPartyFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (type: 'company' | 'party', file: File | null) => {
    if (type === 'company') {
      setCompanyFile(file);
    } else {
      setPartyFile(file);
    }
  };

  const handleSubmit = () => {
    if (!companyFile || !partyFile) {
      toast({
        title: "Missing Files",
        description: "Please upload both Company and Party data files.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Files Uploaded Successfully",
      description: "Your files are being processed for reconciliation.",
    });

    // Here you would typically upload the files to your backend
    // For now, we'll just simulate the process
    setTimeout(() => {
      window.location.href = "/results";
    }, 2000);
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
            {/* Company Data Upload */}
            <Card className="shadow-card">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-finance-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileSpreadsheet className="w-8 h-8 text-finance-primary" />
                </div>
                <CardTitle className="text-2xl">Company Data</CardTitle>
                <CardDescription>
                  Upload your company's financial records and transaction data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-file">Select Company File</Label>
                  <div className="relative">
                    <Input
                      id="company-file"
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={(e) => handleFileChange('company', e.target.files?.[0] || null)}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-finance-secondary file:text-finance-primary"
                    />
                  </div>
                </div>
                {companyFile && (
                  <div className="p-3 bg-finance-success/10 rounded-lg border border-finance-success/20">
                    <p className="text-sm text-finance-success font-medium">
                      ✓ {companyFile.name} uploaded successfully
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Party Data Upload */}
            <Card className="shadow-card">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileSpreadsheet className="w-8 h-8 text-accent" />
                </div>
                <CardTitle className="text-2xl">Party Data</CardTitle>
                <CardDescription>
                  Upload the third-party or counterparty transaction records
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="party-file">Select Party File</Label>
                  <div className="relative">
                    <Input
                      id="party-file"
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={(e) => handleFileChange('party', e.target.files?.[0] || null)}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-finance-secondary file:text-finance-primary"
                    />
                  </div>
                </div>
                {partyFile && (
                  <div className="p-3 bg-finance-success/10 rounded-lg border border-finance-success/20">
                    <p className="text-sm text-finance-success font-medium">
                      ✓ {partyFile.name} uploaded successfully
                    </p>
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

          {/* Help Text */}
          <div className="bg-muted/50 rounded-lg p-6 text-center">
            <h3 className="font-semibold mb-2">Supported File Formats</h3>
            <p className="text-sm text-muted-foreground">
              CSV, Excel (.xlsx, .xls). Maximum file size: 50MB. 
              Ensure your files contain transaction dates, amounts, and reference numbers for optimal matching.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Upload;