/**
 * Weekly Analytics Report Email Template
 * Generates a beautiful HTML email with photo and visitor statistics
 */

export function generateWeeklyReportHTML(reportData) {
    const { period, photoStats, visitorStats, reportDate } = reportData;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Weekly Analytics Report</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
            text-align: center;
            color: white;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 14px;
        }
        .content {
            padding: 30px 20px;
        }
        .section {
            margin-bottom: 30px;
        }
        .section-title {
            font-size: 20px;
            font-weight: 600;
            color: #1a202c;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e2e8f0;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 20px;
        }
        .stat-card {
            background: #f7fafc;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
        }
        .stat-value {
            font-size: 32px;
            font-weight: 700;
            color: #667eea;
            margin-bottom: 5px;
        }
        .stat-label {
            font-size: 14px;
            color: #718096;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .photo-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .photo-item {
            display: flex;
            align-items: center;
            padding: 12px;
            border-bottom: 1px solid #e2e8f0;
        }
        .photo-item:last-child {
            border-bottom: none;
        }
        .photo-rank {
            font-size: 18px;
            font-weight: 700;
            color: #cbd5e0;
            width: 30px;
        }
        .photo-thumbnail {
            width: 80px;
            height: 60px;
            border-radius: 8px;
            object-fit: cover;
            margin-left: 10px;
        }
        .photo-info {
            flex: 1;
            margin-left: 15px;
        }
        .photo-title {
            font-weight: 500;
            color: #2d3748;
            margin-bottom: 3px;
        }
        .photo-filename {
            font-size: 12px;
            color: #a0aec0;
            font-family: 'Courier New', monospace;
        }
        .photo-views {
            font-size: 18px;
            font-weight: 600;
            color: #667eea;
            white-space: nowrap;
        }
        .footer {
            background-color: #f7fafc;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #718096;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            margin-top: 20px;
        }
        .breakdown-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        .breakdown-item:last-child {
            border-bottom: none;
        }
        .breakdown-bar {
            width: 100%;
            height: 8px;
            background: #e2e8f0;
            border-radius: 4px;
            overflow: hidden;
            margin-top: 5px;
        }
        .breakdown-bar-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea, #764ba2);
        }
        @media only screen and (max-width: 600px) {
            .stats-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>📊 Weekly Analytics Report</h1>
            <p>${period.start} - ${period.end}</p>
        </div>

        <!-- Content -->
        <div class="content">
            <!-- Photo View Statistics -->
            <div class="section">
                <h2 class="section-title">📸 Photo View Statistics</h2>

                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-value">${photoStats.totalViews.toLocaleString()}</div>
                        <div class="stat-label">Total Views</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${photoStats.uniqueViewers.toLocaleString()}</div>
                        <div class="stat-label">Unique Viewers</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${photoStats.photosViewed.toLocaleString()}</div>
                        <div class="stat-label">Photos Viewed</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${photoStats.avgViewsPerPhoto}</div>
                        <div class="stat-label">Avg Views/Photo</div>
                    </div>
                </div>

                ${photoStats.mostViewed && photoStats.mostViewed.length > 0 ? `
                <h3 style="margin-top: 25px; margin-bottom: 15px; font-size: 16px; color: #4a5568;">Top 10 Most Viewed Photos</h3>
                <ul class="photo-list">
                    ${photoStats.mostViewed.slice(0, 10).map((photo, index) => `
                        <li class="photo-item">
                            <div class="photo-rank">#${index + 1}</div>
                            ${photo.url ? `<img src="${photo.url}" alt="${photo.title || photo.filename}" class="photo-thumbnail" />` : ''}
                            <div class="photo-info">
                                <div class="photo-title">${photo.title || photo.filename || 'Untitled'}</div>
                                <div class="photo-filename">${photo.filename}</div>
                            </div>
                            <div class="photo-views">${photo.view_count} views</div>
                        </li>
                    `).join('')}
                </ul>
                ` : '<p style="color: #a0aec0; font-style: italic;">No photo views this week</p>'}
            </div>

            <!-- Visitor Statistics -->
            <div class="section">
                <h2 class="section-title">👥 Visitor Analytics</h2>

                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-value">${visitorStats.totalSessions.toLocaleString()}</div>
                        <div class="stat-label">Sessions</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${visitorStats.totalPageViews.toLocaleString()}</div>
                        <div class="stat-label">Page Views</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${visitorStats.avgSessionDuration}</div>
                        <div class="stat-label">Avg Duration</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${visitorStats.mobilePercentage}%</div>
                        <div class="stat-label">Mobile Traffic</div>
                    </div>
                </div>

                ${visitorStats.topCountries && visitorStats.topCountries.length > 0 ? `
                <h3 style="margin-top: 25px; margin-bottom: 15px; font-size: 16px; color: #4a5568;">Top Countries</h3>
                ${visitorStats.topCountries.slice(0, 5).map(country => `
                    <div class="breakdown-item">
                        <div>
                            <span style="font-size: 18px; margin-right: 8px;">${country.flag}</span>
                            <span style="font-weight: 500; color: #2d3748;">${country.name}</span>
                        </div>
                        <span style="font-weight: 600; color: #667eea;">${country.count} visits</span>
                    </div>
                    <div class="breakdown-bar">
                        <div class="breakdown-bar-fill" style="width: ${country.percentage}%;"></div>
                    </div>
                `).join('')}
                ` : ''}
            </div>

            <!-- Call to Action -->
            <div style="text-align: center; margin-top: 30px;">
                <a href="https://jonsson.io/admin" class="button">View Full Dashboard</a>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>This is an automated weekly report from your photography portfolio.</p>
            <p style="margin-top: 5px;">jonsson.io · ${reportDate}</p>
        </div>
    </div>
</body>
</html>
    `.trim();
}

export function generateWeeklyReportText(reportData) {
    const { period, photoStats, visitorStats } = reportData;

    return `
WEEKLY ANALYTICS REPORT
${period.start} - ${period.end}

PHOTO VIEW STATISTICS
=====================
Total Views: ${photoStats.totalViews.toLocaleString()}
Unique Viewers: ${photoStats.uniqueViewers.toLocaleString()}
Photos Viewed: ${photoStats.photosViewed.toLocaleString()}
Avg Views/Photo: ${photoStats.avgViewsPerPhoto}

${photoStats.mostViewed && photoStats.mostViewed.length > 0 ? `
TOP 10 MOST VIEWED PHOTOS:
${photoStats.mostViewed.slice(0, 10).map((photo, index) =>
    `${index + 1}. ${photo.title || photo.filename || 'Untitled'} (${photo.filename}) - ${photo.view_count} views`
).join('\n')}
` : 'No photo views this week'}

VISITOR ANALYTICS
=================
Total Sessions: ${visitorStats.totalSessions.toLocaleString()}
Page Views: ${visitorStats.totalPageViews.toLocaleString()}
Avg Duration: ${visitorStats.avgSessionDuration}
Mobile Traffic: ${visitorStats.mobilePercentage}%

${visitorStats.topCountries && visitorStats.topCountries.length > 0 ? `
TOP COUNTRIES:
${visitorStats.topCountries.slice(0, 5).map(country =>
    `${country.name}: ${country.count} visits`
).join('\n')}
` : ''}

---
View full dashboard: https://jonsson.io/admin
    `.trim();
}
