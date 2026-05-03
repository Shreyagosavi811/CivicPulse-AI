import { jsPDF } from 'jspdf';

export const exportVoterChecklist = (isVerified: boolean, hasInked: boolean, candidate: string | null) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFillColor(59, 130, 246); // Primary Color
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text('OFFICIAL VOTER CHECKLIST', 105, 25, { align: 'center' });
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.text('Generated on: ' + new Date().toLocaleDateString(), 20, 50);
  
  // Section 1: Verification Status
  doc.setFontSize(16);
  doc.text('1. Verification Status', 20, 70);
  doc.setFontSize(11);
  doc.text(`- ID Verification: ${isVerified ? 'SUCCESS' : 'PENDING'}`, 30, 80);
  doc.text(`- Indelible Ink Marked: ${hasInked ? 'YES' : 'NO'}`, 30, 90);
  
  // Section 2: Voting Guide
  doc.setFontSize(16);
  doc.text('2. Election Day Steps', 20, 110);
  doc.setFontSize(11);
  doc.text('Step 1: Present your EPIC/Aadhaar card to the first officer.', 30, 120);
  doc.text('Step 2: Get your finger marked and take the voter slip.', 30, 130);
  doc.text('Step 3: Proceed to the EVM and press the button for your candidate.', 30, 140);
  doc.text('Step 4: Verify your choice on the VVPAT display (7 seconds).', 30, 150);
  
  // Section 3: Prohibited Items
  doc.setFontSize(16);
  doc.text('3. Prohibited Items', 20, 170);
  doc.setFontSize(11);
  doc.text('- No mobile phones or cameras inside the booth.', 30, 180);
  doc.text('- No election campaigning within 100 meters.', 30, 190);
  
  // Footer / Commitment
  doc.setFontSize(14);
  doc.text('Citizen Commitment', 105, 230, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text('"I pledge to vote responsibly and maintain the sanctity of the secret ballot."', 105, 240, { align: 'center' });
  
  doc.save('voter_checklist.pdf');
};
