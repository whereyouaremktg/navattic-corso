"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

type IssueType = "Lost" | "Damaged" | "Stolen";
type CarrierStatus = "In Transit" | "Delivered" | "Exception" | "Pre Transit";
type Resolution = "replacement" | "refund";

interface ShippingClaim {
  id: string;
  orderNumber: string;
  issueType: IssueType;
  carrierStatus: CarrierStatus;
  date: Date;
}

// ============================================================================
// Fake Data
// ============================================================================

const fakeShippingClaims: ShippingClaim[] = [
  {
    id: "1",
    orderNumber: "3183",
    issueType: "Lost",
    carrierStatus: "Exception",
    date: new Date(2024, 1, 15),
  },
  {
    id: "2",
    orderNumber: "3182",
    issueType: "Damaged",
    carrierStatus: "Delivered",
    date: new Date(2024, 1, 14),
  },
  {
    id: "3",
    orderNumber: "3181",
    issueType: "Stolen",
    carrierStatus: "In Transit",
    date: new Date(2024, 1, 13),
  },
  {
    id: "4",
    orderNumber: "3180",
    issueType: "Lost",
    carrierStatus: "Pre Transit",
    date: new Date(2024, 1, 12),
  },
  {
    id: "5",
    orderNumber: "3179",
    issueType: "Damaged",
    carrierStatus: "Exception",
    date: new Date(2024, 1, 11),
  },
  {
    id: "6",
    orderNumber: "3178",
    issueType: "Stolen",
    carrierStatus: "Delivered",
    date: new Date(2024, 1, 10),
  },
];

// ============================================================================
// Resolution Dialog Component
// ============================================================================

interface ResolutionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  claim: ShippingClaim | null;
  onConfirm: (resolution: Resolution) => void;
}

function ResolutionDialog({
  open,
  onOpenChange,
  claim,
  onConfirm,
}: ResolutionDialogProps) {
  const [selectedResolution, setSelectedResolution] =
    useState<Resolution | null>(null);

  const handleConfirm = () => {
    if (selectedResolution) {
      onConfirm(selectedResolution);
      setSelectedResolution(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Resolution</DialogTitle>
          <DialogDescription>
            Choose how to resolve this shipping issue for order #{claim?.orderNumber}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup
            value={selectedResolution || undefined}
            onValueChange={(value) => setSelectedResolution(value as Resolution)}
          >
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="replacement" id="replacement" />
                <Label
                  htmlFor="replacement"
                  className="flex-1 cursor-pointer text-sm font-medium"
                >
                  Reorder Replacement
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="refund" id="refund" />
                <Label
                  htmlFor="refund"
                  className="flex-1 cursor-pointer text-sm font-medium"
                >
                  Refund to Original Payment
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setSelectedResolution(null);
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedResolution}
            style={{
              backgroundColor: "var(--brand-primary)",
              color: "var(--brand-on-primary)",
            }}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// Main AdminShipping Component
// ============================================================================

export function AdminShipping() {
  const [claims] = useState<ShippingClaim[]>(fakeShippingClaims);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<ShippingClaim | null>(null);
  const { toast } = useToast();

  const handleResolveClick = (claim: ShippingClaim) => {
    setSelectedClaim(claim);
    setDialogOpen(true);
  };

  const handleResolutionConfirm = (resolution: Resolution) => {
    const resolutionText =
      resolution === "replacement"
        ? "Reorder Replacement"
        : "Refund to Original Payment";

    toast({
      title: "Resolution Processed",
      description: `Order #${selectedClaim?.orderNumber} has been resolved with: ${resolutionText}`,
    });
  };

  const getIssueTypeBadgeColor = (issueType: IssueType) => {
    switch (issueType) {
      case "Lost":
        return "bg-yellow-100 text-yellow-800";
      case "Damaged":
        return "bg-orange-100 text-orange-800";
      case "Stolen":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCarrierStatusBadgeColor = (status: CarrierStatus) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "In Transit":
        return "bg-blue-100 text-blue-800";
      case "Exception":
        return "bg-red-100 text-red-800";
      case "Pre Transit":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-medium text-gray-800">
            Shipping Claims
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Issue Type</TableHead>
                <TableHead>Carrier Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Resolution</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {claims.map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell className="font-medium">
                    #{claim.orderNumber}
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("capitalize", getIssueTypeBadgeColor(claim.issueType))}>
                      {claim.issueType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("capitalize", getCarrierStatusBadgeColor(claim.carrierStatus))}>
                      {claim.carrierStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {claim.date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      onClick={() => handleResolveClick(claim)}
                      style={{
                        backgroundColor: "var(--brand-primary)",
                        color: "var(--brand-on-primary)",
                      }}
                    >
                      Resolve
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ResolutionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        claim={selectedClaim}
        onConfirm={handleResolutionConfirm}
      />
    </div>
  );
}
