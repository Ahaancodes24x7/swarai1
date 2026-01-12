interface SessionResponse {
  questionId: number;
  questionText: string;
  expectedAnswer: string;
  response: string;
  isCorrect: boolean;
  responseTimeMs?: number;
}

interface AIAnalysis {
  overallAccuracy: number;
  isFlagged: boolean;
  detailedAnalysis: string;
  phonemeErrorRate?: number;
  phonemeConfusions?: string[];
  syllableStressErrors?: boolean;
  letterReversals?: string[];
  wordSubstitutions?: string[];
  transcodingErrors?: string[];
  placeValueErrors?: boolean;
  countingAccuracy?: number;
  operationConfusion?: boolean;
  sequenceErrors?: string[];
  calculationAccuracy?: number;
  confidence?: number;
}

interface SessionData {
  studentName: string;
  studentGrade: number;
  sessionType: 'dyslexia' | 'dyscalculia';
  date: string;
  responses: SessionResponse[];
  score: number;
  isFlagged: boolean;
  aiAnalysis?: AIAnalysis;
  teacherName?: string;
}

export function generatePDFContent(data: SessionData): string {
  const flagStatus = data.isFlagged ? '⚠️ FLAGGED FOR FURTHER EVALUATION' : '✓ WITHIN NORMAL RANGE';
  const flagColor = data.isFlagged ? '#dc2626' : '#16a34a';
  
  const correctResponses = data.responses.filter(r => r.isCorrect).length;
  const totalQuestions = data.responses.length;

  // Build response details HTML
  const responseRows = data.responses.map((r, index) => `
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 12px; text-align: center;">${index + 1}</td>
      <td style="padding: 12px;">${escapeHtml(r.questionText)}</td>
      <td style="padding: 12px;">${escapeHtml(r.expectedAnswer)}</td>
      <td style="padding: 12px;">${escapeHtml(r.response)}</td>
      <td style="padding: 12px; text-align: center;">
        <span style="display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;
          background-color: ${r.isCorrect ? '#dcfce7' : '#fee2e2'}; 
          color: ${r.isCorrect ? '#166534' : '#991b1b'};">
          ${r.isCorrect ? 'Correct' : 'Incorrect'}
        </span>
      </td>
      ${r.responseTimeMs ? `<td style="padding: 12px; text-align: center;">${(r.responseTimeMs / 1000).toFixed(1)}s</td>` : ''}
    </tr>
  `).join('');

  // Build AI Analysis section if available
  let aiAnalysisSection = '';
  if (data.aiAnalysis) {
    const analysis = data.aiAnalysis;
    
    if (data.sessionType === 'dyslexia') {
      aiAnalysisSection = `
        <div style="margin-top: 30px; padding: 20px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
          <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 18px;">🧠 AI Speech Analysis Results</h3>
          
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 20px;">
            <div style="padding: 15px; background: white; border-radius: 6px; text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #6366f1;">${analysis.phonemeErrorRate?.toFixed(1) || 'N/A'}%</div>
              <div style="font-size: 12px; color: #64748b;">Phoneme Error Rate</div>
              <div style="font-size: 10px; color: ${(analysis.phonemeErrorRate || 0) > 10 ? '#dc2626' : '#16a34a'};">
                ${(analysis.phonemeErrorRate || 0) > 10 ? 'Above threshold (>10%)' : 'Within normal range'}
              </div>
            </div>
            <div style="padding: 15px; background: white; border-radius: 6px; text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #6366f1;">${analysis.overallAccuracy?.toFixed(1) || 'N/A'}%</div>
              <div style="font-size: 12px; color: #64748b;">Overall Accuracy</div>
            </div>
            <div style="padding: 15px; background: white; border-radius: 6px; text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #6366f1;">${analysis.confidence || 'N/A'}%</div>
              <div style="font-size: 12px; color: #64748b;">AI Confidence</div>
            </div>
          </div>

          ${analysis.phonemeConfusions?.length ? `
            <div style="margin-bottom: 15px;">
              <strong style="color: #1e293b;">Phoneme Confusions Detected:</strong>
              <div style="margin-top: 5px; color: #64748b;">${analysis.phonemeConfusions.join(', ')}</div>
            </div>
          ` : ''}

          ${analysis.letterReversals?.length ? `
            <div style="margin-bottom: 15px;">
              <strong style="color: #1e293b;">Letter Reversals:</strong>
              <div style="margin-top: 5px; color: #64748b;">${analysis.letterReversals.join(', ')}</div>
            </div>
          ` : ''}

          ${analysis.syllableStressErrors ? `
            <div style="margin-bottom: 15px; padding: 10px; background: #fef3c7; border-radius: 6px;">
              <strong style="color: #92400e;">⚠️ Syllable Stress Pattern Deviance Detected</strong>
            </div>
          ` : ''}

          <div style="margin-top: 15px; padding: 15px; background: white; border-radius: 6px;">
            <strong style="color: #1e293b;">Detailed Analysis:</strong>
            <p style="margin: 10px 0 0 0; color: #475569; line-height: 1.6;">${escapeHtml(analysis.detailedAnalysis)}</p>
          </div>
        </div>
      `;
    } else {
      aiAnalysisSection = `
        <div style="margin-top: 30px; padding: 20px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
          <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 18px;">🧠 AI Mathematical Analysis Results</h3>
          
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 20px;">
            <div style="padding: 15px; background: white; border-radius: 6px; text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #6366f1;">${analysis.calculationAccuracy?.toFixed(1) || 'N/A'}%</div>
              <div style="font-size: 12px; color: #64748b;">Calculation Accuracy</div>
            </div>
            <div style="padding: 15px; background: white; border-radius: 6px; text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #6366f1;">${analysis.countingAccuracy?.toFixed(1) || 'N/A'}%</div>
              <div style="font-size: 12px; color: #64748b;">Counting Accuracy</div>
            </div>
            <div style="padding: 15px; background: white; border-radius: 6px; text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #6366f1;">${analysis.confidence || 'N/A'}%</div>
              <div style="font-size: 12px; color: #64748b;">AI Confidence</div>
            </div>
          </div>

          ${analysis.transcodingErrors?.length ? `
            <div style="margin-bottom: 15px;">
              <strong style="color: #1e293b;">Transcoding Errors Detected:</strong>
              <div style="margin-top: 5px; color: #64748b;">${analysis.transcodingErrors.join(', ')}</div>
            </div>
          ` : ''}

          ${analysis.placeValueErrors ? `
            <div style="margin-bottom: 15px; padding: 10px; background: #fef3c7; border-radius: 6px;">
              <strong style="color: #92400e;">⚠️ Place-Value Understanding Issues Detected</strong>
            </div>
          ` : ''}

          ${analysis.operationConfusion ? `
            <div style="margin-bottom: 15px; padding: 10px; background: #fef3c7; border-radius: 6px;">
              <strong style="color: #92400e;">⚠️ Operation Confusion Detected</strong>
            </div>
          ` : ''}

          <div style="margin-top: 15px; padding: 15px; background: white; border-radius: 6px;">
            <strong style="color: #1e293b;">Detailed Analysis:</strong>
            <p style="margin: 10px 0 0 0; color: #475569; line-height: 1.6;">${escapeHtml(analysis.detailedAnalysis)}</p>
          </div>
        </div>
      `;
    }
  }

  // Flagging criteria section based on session type
  const flaggingCriteria = data.sessionType === 'dyslexia' ? `
    <div style="margin-top: 30px; padding: 20px; background-color: #eff6ff; border-radius: 8px; border: 1px solid #bfdbfe;">
      <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 16px;">📋 DSM-5 Dyslexia Flagging Criteria Applied</h3>
      <ul style="margin: 0; padding-left: 20px; color: #1e40af; line-height: 1.8;">
        <li>Phoneme Error Rate (PER) >10% on repeated reading/naming tasks</li>
        <li>Consistent phoneme confusions (labials, fricatives, stops)</li>
        <li>Syllable stress pattern deviance</li>
        <li>Reading accuracy/fluency/comprehension ≤16th percentile</li>
      </ul>
    </div>
  ` : `
    <div style="margin-top: 30px; padding: 20px; background-color: #eff6ff; border-radius: 8px; border: 1px solid #bfdbfe;">
      <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 16px;">📋 DSM-5 Dyscalculia Flagging Criteria Applied</h3>
      <ul style="margin: 0; padding-left: 20px; color: #1e40af; line-height: 1.8;">
        <li>Mathematics Performance ≤16th percentile</li>
        <li>Transcoding errors (confusing number words/digits)</li>
        <li>Place-value misunderstanding</li>
        <li>Persistent finger-counting on easy/repeated tasks</li>
        <li>Operation confusion (+, -, ×, ÷)</li>
      </ul>
    </div>
  `;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>SWAR Assessment Report - ${escapeHtml(data.studentName)}</title>
  <style>
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 40px; background: white; }
    .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #6366f1; }
    .logo { font-size: 32px; font-weight: bold; color: #6366f1; }
    .subtitle { color: #64748b; margin-top: 5px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th { background-color: #6366f1; color: white; padding: 12px; text-align: left; }
    .print-btn { position: fixed; top: 20px; right: 20px; padding: 10px 20px; background: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }
    .print-btn:hover { background: #4f46e5; }
    @media print { .print-btn { display: none; } }
  </style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">🖨️ Print / Save PDF</button>
  
  <div class="header">
    <div class="logo">🎯 SWAR</div>
    <div class="subtitle">Speech-based Screening for Learning Disabilities</div>
    <div style="margin-top: 10px; font-size: 14px; color: #94a3b8;">Detect • Support • Include</div>
  </div>

  <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
    <div style="flex: 1;">
      <h2 style="margin: 0; color: #1e293b;">${data.sessionType === 'dyslexia' ? 'Dyslexia' : 'Dyscalculia'} Assessment Report</h2>
      <p style="color: #64748b; margin: 5px 0 0 0;">Generated on ${data.date}</p>
    </div>
    <div style="text-align: right;">
      <div style="padding: 15px 25px; border-radius: 8px; font-weight: bold; font-size: 14px; background-color: ${data.isFlagged ? '#fee2e2' : '#dcfce7'}; color: ${flagColor};">
        ${flagStatus}
      </div>
    </div>
  </div>

  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px;">
    <div style="padding: 20px; background-color: #f1f5f9; border-radius: 8px;">
      <h4 style="margin: 0 0 10px 0; color: #475569;">Student Information</h4>
      <p style="margin: 5px 0;"><strong>Name:</strong> ${escapeHtml(data.studentName)}</p>
      <p style="margin: 5px 0;"><strong>Grade:</strong> ${data.studentGrade}</p>
      <p style="margin: 5px 0;"><strong>Assessment Type:</strong> ${data.sessionType === 'dyslexia' ? 'Dyslexia Screening' : 'Dyscalculia Screening'}</p>
    </div>
    <div style="padding: 20px; background-color: #f1f5f9; border-radius: 8px;">
      <h4 style="margin: 0 0 10px 0; color: #475569;">Session Summary</h4>
      <p style="margin: 5px 0;"><strong>Overall Score:</strong> ${data.score}%</p>
      <p style="margin: 5px 0;"><strong>Correct Responses:</strong> ${correctResponses} of ${totalQuestions}</p>
      ${data.teacherName ? `<p style="margin: 5px 0;"><strong>Administered By:</strong> ${escapeHtml(data.teacherName)}</p>` : ''}
    </div>
  </div>

  <h3 style="color: #1e293b; margin-bottom: 15px;">📝 Detailed Responses</h3>
  <table>
    <thead>
      <tr>
        <th style="width: 50px;">#</th>
        <th>Question</th>
        <th>Expected</th>
        <th>Response</th>
        <th style="width: 100px;">Result</th>
      </tr>
    </thead>
    <tbody>
      ${responseRows}
    </tbody>
  </table>

  ${aiAnalysisSection}

  ${flaggingCriteria}

  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 12px;">
    <p>This report is generated by SWAR - Speech-based Screening for Learning Disabilities</p>
    <p>For professional diagnosis, please consult with a qualified specialist.</p>
    <p style="margin-top: 10px;">© ${new Date().getFullYear()} SWAR. All rights reserved.</p>
  </div>
</body>
</html>
  `;
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function downloadPDF(data: SessionData): void {
  const htmlContent = generatePDFContent(data);
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  const newWindow = window.open(url, '_blank');
  if (newWindow) {
    newWindow.onload = () => {
      URL.revokeObjectURL(url);
    };
  }
}

export function printPDF(data: SessionData): void {
  const htmlContent = generatePDFContent(data);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}
