export type TranslationKey = 
  // App
  | 'app.title'
  
  // Navigation
  | 'nav.dashboard'
  | 'nav.myPRs'
  | 'nav.createPR'
  | 'nav.approvals'
  | 'nav.accounting'
  | 'nav.reports'
  | 'nav.users'
  | 'nav.settings'
  | 'nav.newRequest'
  | 'nav.profile'
  | 'nav.notifications'
  | 'nav.logout'
  
  // Notifications
  | 'notifications.markAllRead'
  | 'notifications.viewAll'
  | 'notifications.empty'
  | 'notifications.time.minutes'
  | 'notifications.time.hours'
  | 'notifications.time.days'
  | 'notifications.approval.title'
  | 'notifications.approval.message'
  | 'notifications.approved.title'
  | 'notifications.approved.message'
  | 'notifications.rejected.title'
  | 'notifications.rejected.message'
  | 'notifications.assignment.title'
  | 'notifications.assignment.message'
  | 'notifications.reminder.title'
  | 'notifications.reminder.message'
  
  // Dashboard
  | 'dashboard.welcome'
  | 'dashboard.subtitle'
  | 'dashboard.totalPRs'
  | 'dashboard.pendingApprovals'
  | 'dashboard.approvedThisMonth'
  | 'dashboard.budgetUtilization'
  | 'dashboard.requiresAttention'
  | 'dashboard.fromLastMonth'
  | 'dashboard.approachingBudget'
  | 'dashboard.recentRequests'
  | 'dashboard.recentActivity'
  | 'dashboard.viewAll'
  | 'dashboard.view'
  | 'dashboard.insights'
  | 'dashboard.approvalRate'
  | 'dashboard.budgetAlert'
  | 'dashboard.performance'
  | 'dashboard.quickActions'
  | 'dashboard.createNewRequest'
  | 'dashboard.reviewPending'
  | 'dashboard.myRequests'
  | 'dashboard.approvalRateDesc'
  | 'dashboard.budgetAlertDesc'
  | 'dashboard.performanceDesc'
  | 'dashboard.filters.allRequests'
  | 'dashboard.filters.purchaseRequests'
  | 'dashboard.filters.projectRequests'
  | 'dashboard.requestType.purchase'
  | 'dashboard.requestType.project'
  | 'dashboard.totalProjects'
  | 'dashboard.totalProjectValue'
  | 'dashboard.totalProjectBenefit'
  | 'dashboard.projectsCompletionRate'
  | 'dashboard.activeProjects'
  | 'dashboard.estimatedValue'
  | 'dashboard.projectedBenefit'
  | 'dashboard.client'
  | 'dashboard.featuredInsights'
  | 'dashboard.performanceMetrics'
  | 'dashboard.performanceMetricsDesc'
  | 'dashboard.resourceAllocation'
  | 'dashboard.resourceAllocationDesc'
  | 'dashboard.approvalEfficiency'
  | 'dashboard.costOptimization'
  | 'dashboard.userSatisfaction'
  | 'dashboard.viewDetailedAnalytics'
  | 'dashboard.totalBudget'
  | 'dashboard.availableFunds'
  | 'dashboard.completedRequests'
  | 'dashboard.avgProcessTime'
  | 'dashboard.days'
  | 'dashboard.budgetForecast'
  | 'dashboard.budgetForecastDesc'
  | 'dashboard.viewResourceDashboard'
  
  // Reports
  | 'reports.title'
  | 'reports.subtitle'
  | 'reports.exportCSV'
  | 'reports.filters'
  | 'reports.status'
  | 'reports.from'
  | 'reports.to'
  | 'reports.totalSubmitted'
  | 'reports.totalApproved'
  | 'reports.totalSpend'
  | 'reports.approvalRate'
  | 'reports.prVolumeByMonth'
  | 'reports.spendByCategory'
  | 'reports.topRequesters'
  | 'reports.name'
  | 'reports.requests'
  | 'reports.totalSpendCol'
  
  // Common
  | 'common.status'
  | 'common.all'
  | 'common.submitted'
  | 'common.approved'
  | 'common.rejected'
  | 'common.pending'
  | 'common.search'
  | 'common.filter'
  | 'common.export'
  | 'common.save'
  | 'common.cancel'
  | 'common.edit'
  | 'common.delete'
  | 'common.view'
  | 'common.create'
  | 'common.update'
  | 'common.loading'
  | 'common.error'
  | 'common.success'
  | 'common.warning'
  | 'common.info'
  | 'common.close'
  | 'common.back'
  | 'common.next'
  | 'common.previous'
  | 'common.yes'
  | 'common.no'
  | 'common.confirm'
  | 'common.logout'
  | 'common.profile'
  | 'common.notifications'
  | 'common.searchPlaceholder'
  | 'common.reset'
  | 'common.by'
  | 'common.priority.high'
  | 'common.priority.medium'
  | 'common.priority.low'
  
  // PR Create
  | 'prCreate.backToPRs'
  | 'prCreate.title'
  | 'prCreate.subtitle'
  | 'prCreate.stepBasicInfo'
  | 'prCreate.stepItems'
  | 'prCreate.stepProjectDetails'
  | 'prCreate.stepReview'
  | 'prCreate.basicInfoTitle'
  | 'prCreate.basicInfoDescription'
  | 'prCreate.fieldTitle'
  | 'prCreate.fieldTitlePlaceholder'
  | 'prCreate.errorTitleMin'
  | 'prCreate.errorTitleMax'
  | 'prCreate.fieldCategory'
  | 'prCreate.fieldCategoryPlaceholder'
  | 'prCreate.errorCategoryRequired'
  | 'prCreate.fieldDescription'
  | 'prCreate.fieldDescriptionPlaceholder'
  | 'prCreate.errorDescriptionMax'
  | 'prCreate.fieldEstimatedCost'
  | 'prCreate.fieldCostPlaceholder'
  | 'prCreate.errorDesiredCost'
  | 'prCreate.fieldCurrency'
  | 'prCreate.fieldCurrencyPlaceholder'
  | 'prCreate.fieldNeededByDate'
  | 'prCreate.errorNeededByDate'
  | 'prCreate.pickDate'
  | 'prCreate.fieldRequestType'
  | 'prCreate.requestType.purchase'
  | 'prCreate.requestType.project'
  | 'prCreate.itemsTitle'
  | 'prCreate.itemsDescription'
  | 'prCreate.item'
  | 'prCreate.errorItemNameRequired'
  | 'prCreate.fieldItemName'
  | 'prCreate.fieldItemNamePlaceholder'
  | 'prCreate.fieldVendorHint'
  | 'prCreate.fieldVendorHintPlaceholder'
  | 'prCreate.fieldQuantity'
  | 'prCreate.errorQuantityMin'
  | 'prCreate.fieldUnitPrice'
  | 'prCreate.errorUnitPrice'
  | 'prCreate.fieldTotal'
  | 'prCreate.addItem'
  | 'prCreate.totalCost'
  | 'prCreate.errorAtLeastOneItem'
  | 'prCreate.uploadQuotesTitle'
  | 'prCreate.uploadQuotesDescription'
  | 'prCreate.accountantQuotesOnly'
  | 'prCreate.quotesAddedByAccountant'
  | 'prCreate.supportedFormats'
  | 'prCreate.reviewTitle'
  | 'prCreate.reviewDescription'
  | 'prCreate.reviewFieldTitle'
  | 'prCreate.reviewFieldCategory'
  | 'prCreate.reviewFieldEstimatedCost'
  | 'prCreate.reviewFieldNeededBy'
  | 'prCreate.reviewFieldDescription'
  | 'prCreate.reviewItems'
  | 'prCreate.reviewTotal'
  | 'prCreate.reviewUploadedFiles'
  | 'prCreate.buttonPrevious'
  | 'prCreate.buttonNext'
  | 'prCreate.buttonSubmit'
  | 'prCreate.categories.itEquipment'
  | 'prCreate.categories.officeSupplies'
  | 'prCreate.categories.softwareLicenses'
  | 'prCreate.categories.marketingMaterials'
  | 'prCreate.categories.travelAccommodation'
  | 'prCreate.categories.professionalServices'
  | 'prCreate.categories.trainingDevelopment'
  | 'prCreate.categories.facilitiesMaintenance'
  | 'prCreate.categories.other'
  | 'prCreate.categories.softwareDevelopment'
  | 'prCreate.categories.consultingServices'
  | 'prCreate.categories.researchDevelopment'
  | 'prCreate.categories.infrastructureProjects'
  | 'prCreate.categories.digitalTransformation'
  | 'prCreate.fieldClientName'
  | 'prCreate.fieldClientNamePlaceholder'
  | 'prCreate.fieldProjectDescription'
  | 'prCreate.fieldProjectDescriptionPlaceholder'
  | 'prCreate.fieldTotalCost'
  | 'prCreate.fieldTotalBenefit'
  | 'prCreate.fieldTotalPrice'
  | 'prCreate.projectDetailsTitle'
  | 'prCreate.projectDetailsDescription'
  | 'prCreate.itemsDescriptionPurchase'
  | 'prCreate.itemsDescriptionProject'
  | 'prCreate.projectItemsOptionalMessage'
  | 'prCreate.reviewProjectDetails'
  | 'prCreate.requestType.label'
  | 'prCreate.fieldBenefitPlaceholder'
  | 'prCreate.fieldPricePlaceholder'
  | 'prCreate.errorClientNameRequired'
  | 'prCreate.errorProjectDescriptionRequired'
  | 'prCreate.errorTotalCost'
  | 'prCreate.errorTotalBenefit'
  | 'prCreate.errorTotalPrice'

  // PR Details
  | 'prDetails.backToPRs'
  | 'prDetails.prNumber'
  | 'prDetails.review'
  | 'prDetails.reviewDialogTitle'
  | 'prDetails.reviewDialogDescription'
  | 'prDetails.decision'
  | 'prDetails.selectDecision'
  | 'prDetails.approve'
  | 'prDetails.reject'
  | 'prDetails.payoutChannel'
  | 'prDetails.selectPayoutChannel'
  | 'prDetails.payoutWallet'
  | 'prDetails.payoutCompany'
  | 'prDetails.payoutCourier'
  | 'prDetails.comment'
  | 'prDetails.commentPlaceholder'
  | 'prDetails.commentRequired'
  | 'prDetails.submitDecision'
  | 'prDetails.markFundsTransferred'
  | 'prDetails.fundsDialogTitle'
  | 'prDetails.fundsDialogDescription'
  | 'prDetails.payoutReference'
  | 'prDetails.payoutReferencePlaceholder'
  | 'prDetails.transferDate'
  | 'prDetails.markAsTransferred'
  | 'prDetails.stepDraft'
  | 'prDetails.stepSubmitted'
  | 'prDetails.stepManagerApproved'
  | 'prDetails.stepAccountantApproved'
  | 'prDetails.stepFinalApproved'
  | 'prDetails.stepFundsTransferred'
  | 'prDetails.tabOverview'
  | 'prDetails.tabItems'
  | 'prDetails.tabQuotes'
  | 'prDetails.tabApprovals'
  | 'prDetails.requestDetails'
  | 'prDetails.category'
  | 'prDetails.estimatedCost'
  | 'prDetails.neededBy'
  | 'prDetails.created'
  | 'prDetails.description'
  | 'prDetails.itemsCount'
  | 'prDetails.quantity'
  | 'prDetails.unitPrice'
  | 'prDetails.vendorHint'
  | 'prDetails.total'
  | 'prDetails.quotesCount'
  | 'prDetails.vendorName'
  | 'prDetails.quoteTotal'
  | 'prDetails.uploaded'
  | 'prDetails.view'
  | 'prDetails.download'
  | 'prDetails.noQuotes'
  | 'prDetails.uploadQuote'
  | 'prDetails.accountantQuotesOnly'
  | 'prDetails.uploadQuoteDialogTitle'
  | 'prDetails.uploadQuoteDialogDescription'
  | 'prDetails.vendorName'
  | 'prDetails.vendorNamePlaceholder'
  | 'prDetails.quoteTotal'
  | 'prDetails.submitQuote'
  | 'prDetails.toast.quoteUploadSuccess'
  | 'prDetails.toast.noQuoteFiles'
  | 'prDetails.toast.fileTooLarge'
  | 'prDetails.approvalHistory'
  | 'prDetails.stageApproval'
  | 'prDetails.stage.DM'
  | 'prDetails.stage.ACCT'
  | 'prDetails.stage.FINAL'
  | 'prDetails.decided'
  | 'prDetails.pendingSince'
  | 'prDetails.requester'
  | 'prDetails.currentApprover'
  | 'prDetails.quickActions'
  | 'prDetails.exportPdf'
  | 'prDetails.addComment'
  | 'prDetails.editRequest'
  | 'prDetails.toast.approvalSuccess'
  | 'prDetails.toast.approvalError'
  | 'prDetails.toast.fundsSuccess'
  | 'prDetails.toast.fundsError'
  | 'prDetails.toast.downloadingQuote'
  | 'prDetails.payoutReferenceRequired'

  // Accounting
  | 'accounting.title'
  | 'accounting.subtitle'
  | 'accounting.period.currentMonth'
  | 'accounting.period.lastMonth'
  | 'accounting.period.quarter'
  | 'accounting.period.year'
  | 'accounting.exportReport'
  | 'accounting.stats.pendingTransfers'
  | 'accounting.stats.monthlyBudgetUsed'
  | 'accounting.stats.approvedThisMonth'
  | 'accounting.stats.activeDepartments'
  | 'accounting.stats.fromLastMonth'
  | 'accounting.tabs.transfers'
  | 'accounting.tabs.transactions'
  | 'accounting.tabs.budgets'
  | 'accounting.tabs.reports'
  | 'accounting.transfers.title'
  | 'accounting.transfers.description'
  | 'accounting.transfers.approved'
  | 'accounting.transfers.transferFunds'
  | 'accounting.transactions.title'
  | 'accounting.transactions.description'
  | 'accounting.budgets.title'
  | 'accounting.budgets.description'
  | 'accounting.budgets.utilized'
  | 'accounting.budgets.remaining'
  | 'accounting.reports.financialSummary.title'
  | 'accounting.reports.financialSummary.description'
  | 'accounting.reports.budgetAnalysis.title'
  | 'accounting.reports.budgetAnalysis.description'
  | 'accounting.reports.transactionHistory.title'
  | 'accounting.reports.transactionHistory.description'
  | 'accounting.reports.generate'
  | 'accounting.toast.transferInitiated'
  | 'accounting.toast.reportGenerating'

  // Admin Users
  | 'admin.users.title'
  | 'admin.users.subtitle'
  | 'admin.users.addUser'
  | 'admin.users.createDialog.title'
  | 'admin.users.createDialog.description'
  | 'admin.users.createDialog.fullName'
  | 'admin.users.createDialog.fullNamePlaceholder'
  | 'admin.users.createDialog.email'
  | 'admin.users.createDialog.emailPlaceholder'
  | 'admin.users.createDialog.role'
  | 'admin.users.createDialog.createUser'
  | 'admin.users.stats.total'
  | 'admin.users.stats.active'
  | 'admin.users.stats.inactive'
  | 'admin.users.stats.admins'
  | 'admin.users.list.title'
  | 'admin.users.list.subtitle'
  | 'admin.users.list.searchPlaceholder'
  | 'admin.users.list.filterRole'
  | 'admin.users.list.filterStatus'
  | 'admin.users.list.allRoles'
  | 'admin.users.list.allStatuses'
  | 'admin.users.list.statusActive'
  | 'admin.users.list.statusInactive'
  | 'admin.users.list.lastLogin'
  | 'admin.users.list.never'
  | 'admin.users.editDialog.title'
  | 'admin.users.editDialog.description'
  | 'admin.users.editDialog.save'
  | 'admin.users.toast.created'
  | 'admin.users.toast.deleted'
  | 'admin.users.toast.statusUpdated'
  | 'admin.users.toast.updated'
  // Admin Settings
  | 'admin.settings.title'
  | 'admin.settings.subtitle'
  | 'admin.settings.saveButton'
  | 'admin.settings.saveSuccess'
  | 'admin.settings.tabs.general'
  | 'admin.settings.tabs.approval'
  | 'admin.settings.tabs.notifications'
  | 'admin.settings.tabs.security'
  | 'admin.settings.tabs.integrations'
  | 'admin.settings.general.title'
  | 'admin.settings.general.description'
  | 'admin.settings.general.companyName'
  | 'admin.settings.general.companyEmail'
  | 'admin.settings.general.timezone'
  | 'admin.settings.general.currency'
  | 'admin.settings.timezones.new_york'
  | 'admin.settings.timezones.chicago'
  | 'admin.settings.timezones.denver'
  | 'admin.settings.timezones.los_angeles'
  | 'admin.settings.timezones.london'
  | 'admin.settings.timezones.berlin'
  | 'admin.settings.timezones.tokyo'
  | 'admin.settings.currencies.usd'
  | 'admin.settings.currencies.eur'
  | 'admin.settings.currencies.gbp'
  | 'admin.settings.currencies.cad'
  | 'admin.settings.currencies.aud'
  | 'admin.settings.approval.title'
  | 'admin.settings.approval.description'
  | 'admin.settings.approval.autoApprovalThreshold'
  | 'admin.settings.approval.autoApprovalThresholdHint'
  | 'admin.settings.approval.requireManagerApproval'
  | 'admin.settings.approval.requireManagerApprovalHint'
  | 'admin.settings.approval.requireAccountantApproval'
  | 'admin.settings.approval.requireAccountantApprovalHint'
  | 'admin.settings.approval.requireFinalManagerApproval'
  | 'admin.settings.approval.requireFinalManagerApprovalHint'
  | 'admin.settings.approval.approvalTimeout'
  | 'admin.settings.approval.approvalTimeoutHint'
  | 'admin.settings.notifications.title'
  | 'admin.settings.notifications.description'
  | 'admin.settings.notifications.emailNotifications'
  | 'admin.settings.notifications.emailNotificationsHint'
  | 'admin.settings.notifications.slackIntegration'
  | 'admin.settings.notifications.slackIntegrationHint'
  | 'admin.settings.notifications.reminderFrequency'
  | 'admin.settings.notifications.triggersTitle'
  | 'admin.settings.notifications.onSubmission'
  | 'admin.settings.notifications.onSubmissionHint'
  | 'admin.settings.notifications.onApproval'
  | 'admin.settings.notifications.onApprovalHint'
  | 'admin.settings.notifications.onRejection'
  | 'admin.settings.notifications.onRejectionHint'
  | 'admin.settings.frequencies.never'
  | 'admin.settings.frequencies.daily'
  | 'admin.settings.frequencies.weekly'
  | 'admin.settings.frequencies.monthly'
  | 'admin.settings.frequencies.hourly'
  | 'admin.settings.security.title'
  | 'admin.settings.security.description'
  | 'admin.settings.security.sessionTimeout'
  | 'admin.settings.security.passwordMinLength'
  | 'admin.settings.security.requireMFA'
  | 'admin.settings.security.requireMFAHint'
  | 'admin.settings.security.allowedFileTypes'
  | 'admin.settings.security.allowedFileTypesHint'
  | 'admin.settings.security.maxFileSize'
  | 'admin.settings.integrations.title'
  | 'admin.settings.integrations.description'
  | 'admin.settings.integrations.erpIntegration'
  | 'admin.settings.integrations.erpIntegrationHint'
  | 'admin.settings.integrations.erpApiEndpoint'
  | 'admin.settings.integrations.erpApiKey'
  | 'admin.settings.integrations.erpApiKeyPlaceholder'
  | 'admin.settings.integrations.backupFrequency'
  | 'admin.settings.integrations.maintenanceTitle'
  | 'admin.settings.integrations.backupDb'
  | 'admin.settings.integrations.exportLog'
  | 'admin.settings.integrations.syncDir'
  | 'admin.settings.integrations.healthCheck'
  // Login Page
  | 'login.title'
  | 'login.subtitle'
  | 'login.welcome'
  | 'login.welcomeSubtitle'
  | 'login.emailLabel'
  | 'login.emailPlaceholder'
  | 'login.passwordLabel'
  | 'login.passwordPlaceholder'
  | 'login.rememberMe'
  | 'login.forgotPassword'
  | 'login.signInButton'
  | 'login.signingInButton'
  | 'login.demoCredentials'
  | 'login.demo.admin'
  | 'login.demo.manager'
  | 'login.demo.accountant'
  | 'login.demo.user'
  | 'login.demo.password'
  | 'login.errors.invalidEmail'
  | 'login.errors.passwordRequired'
  // Not Found Page
  | 'notfound.title'
  | 'notfound.message'
  | 'notfound.link'

  // Statuses
  | 'status.DRAFT'
  | 'status.PENDING'
  | 'status.REJECTED'
  | 'status.APPROVED'
  | 'status.SUBMITTED'
  | 'status.DM_APPROVED'
  | 'status.ACCT_APPROVED'
  | 'status.FINAL_APPROVED'
  | 'status.FUNDS_TRANSFERRED'

  // Roles
  | 'roles.USER'
  | 'roles.MANAGER'
  | 'roles.ACCOUNTANT'
  | 'roles.ADMIN'
  | 'roles.DIRECT_MANAGER'
  | 'roles.FINAL_MANAGER'
  
  // Unauthorized Page
  | 'unauthorized.title'
  | 'unauthorized.message'
  | 'unauthorized.back'
  
  // PR Store Toasts
  | 'pr.toast.createSuccess'
  | 'pr.toast.createError'
  | 'pr.toast.updateSuccess'
  | 'pr.toast.updateError'
  | 'pr.toast.deleteSuccess'
  | 'pr.toast.deleteError'
  | 'pr.toast.fetchError'
  | 'pr.toast.approveSuccess'
  | 'pr.toast.approveError'
  | 'pr.toast.rejectSuccess'
  | 'pr.toast.rejectError'

  // Auth Toasts
  | 'auth.toast.welcomeBack'
  | 'auth.toast.logoutSuccess'
  
  // Approvals Page
  | 'approvals.stats.urgentWithin3Days'
  | 'approvals.labels.sla'
  | 'approvals.labels.id'
  | 'approvals.labels.due'
  | 'approvals.empty.title'
  | 'approvals.empty.filtered'
  | 'approvals.empty.allCaughtUp'
  ;

export const translations: Record<'en' | 'ar', Record<TranslationKey, string>> = {
  en: {
    // App
    'app.title': 'PR System',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.myPRs': 'My PRs',
    'nav.createPR': 'Create PR',
    'nav.approvals': 'Approvals',
    'nav.accounting': 'Accounting',
    'nav.reports': 'Reports',
    'nav.users': 'Users',
    'nav.settings': 'Settings',
    'nav.newRequest': 'New Request',
    'nav.profile': 'Profile Settings',
    'nav.notifications': 'Notifications',
    'nav.logout': 'Log out',
    
    // Dashboard
    'dashboard.welcome': 'Welcome back',
    'dashboard.subtitle': "Here's what's happening with your purchase requests today.",
    'dashboard.totalPRs': 'Total PRs',
    'dashboard.pendingApprovals': 'Pending Approvals',
    'dashboard.approvedThisMonth': 'Approved This Month',
    'dashboard.budgetUtilization': 'Budget Utilization',
    'dashboard.requiresAttention': 'Requires your attention',
    'dashboard.fromLastMonth': 'from last month',
    'dashboard.approachingBudget': 'Approaching budget limit',
    'dashboard.recentRequests': 'Recent Requests',
    'dashboard.recentActivity': 'Recent Activity',
    'dashboard.viewAll': 'View all',
    'dashboard.view': 'View',
    'dashboard.insights': 'Insights',
    'dashboard.approvalRate': 'Approval Rate',
    'dashboard.budgetAlert': 'Budget Alert',
    'dashboard.performance': 'Performance',
    'dashboard.quickActions': 'Quick Actions',
    'dashboard.createNewRequest': 'Create New Request',
    'dashboard.reviewPending': 'Review Pending',
    'dashboard.myRequests': 'My Requests',
  'dashboard.approvalRateDesc': '92% of requests approved this month (+5% vs last month)',
  'dashboard.budgetAlertDesc': 'Team budget is 78% utilized for this quarter',
    'dashboard.performanceDesc': 'Average approval time reduced by 2 days',
    'dashboard.filters.allRequests': 'All Requests',
    'dashboard.filters.purchaseRequests': 'Purchase Requests',
    'dashboard.filters.projectRequests': 'Project Requests',
    'dashboard.requestType.purchase': 'Purchase',
    'dashboard.requestType.project': 'Project',
    'dashboard.totalProjects': 'Total Projects',
    'dashboard.totalProjectValue': 'Project Value',
    'dashboard.totalProjectBenefit': 'Project Benefit',
    'dashboard.projectsCompletionRate': 'Completion Rate',
    'dashboard.activeProjects': 'active projects',
    'dashboard.estimatedValue': 'estimated total value',
    'dashboard.projectedBenefit': 'projected ROI',
    'dashboard.client': 'Client',
  'dashboard.featuredInsights': 'Featured Insights',
  'dashboard.performanceMetrics': 'Performance Metrics',
  'dashboard.performanceMetricsDesc': 'Key performance indicators and trends',
  'dashboard.resourceAllocation': 'Resource Allocation',
  'dashboard.resourceAllocationDesc': 'Budget allocation and resource management',
  'dashboard.approvalEfficiency': 'Approval Efficiency',
  'dashboard.costOptimization': 'Cost Optimization',
  'dashboard.userSatisfaction': 'User Satisfaction',
  'dashboard.viewDetailedAnalytics': 'View Detailed Analytics',
  'dashboard.totalBudget': 'Total Budget',
  'dashboard.availableFunds': 'Available Funds',
  'dashboard.completedRequests': 'Completed Requests',
  'dashboard.avgProcessTime': 'Avg. Process Time',
  'dashboard.days': 'days',
  'dashboard.budgetForecast': 'Budget Forecast',
  'dashboard.budgetForecastDesc': 'Based on current spending, you are projected to remain 12% under budget for this quarter.',
  'dashboard.viewResourceDashboard': 'View Resource Dashboard',
    // Reports
    'reports.title': 'Reports',
    'reports.subtitle': 'Manager insights and analytics',
    'reports.exportCSV': 'Export CSV',
    'reports.filters': 'Filters',
    'reports.status': 'Status',
    'reports.from': 'From',
    'reports.to': 'To',
    'reports.totalSubmitted': 'Total Submitted',
    'reports.totalApproved': 'Total Approved',
    'reports.totalSpend': 'Total Spend',
    'reports.approvalRate': 'Approval Rate',
    'reports.prVolumeByMonth': 'PR Volume by Month',
    'reports.spendByCategory': 'Spend by Category',
    'reports.topRequesters': 'Top Requesters',
    'reports.name': 'Name',
    'reports.requests': 'Requests',
    'reports.totalSpendCol': 'Total Spend',
    
    // Common
    'common.status': 'Status',
    'common.all': 'All',
    'common.submitted': 'Submitted',
    'common.approved': 'Approved',
    'common.rejected': 'Rejected',
    'common.pending': 'Pending',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.export': 'Export',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.view': 'View',
    'common.create': 'Create',
    'common.update': 'Update',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.warning': 'Warning',
    'common.info': 'Info',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.confirm': 'Confirm',
    'common.logout': 'Log out',
    'common.profile': 'Profile Settings',
    'common.notifications': 'Notifications',
  'common.searchPlaceholder': 'Search purchase requests...',
  'common.reset': 'Reset',
    'common.by': 'By',
  'common.priority.high': 'High',
  'common.priority.medium': 'Medium',
  'common.priority.low': 'Low',
    
    // PR Create
    'prCreate.backToPRs': 'Back to PRs',
    'prCreate.title': 'Create Purchase Request',
    'prCreate.subtitle': 'Fill out the form to create a new purchase request',
    'prCreate.stepBasicInfo': 'Basic Info',
    'prCreate.stepItems': 'Items',
    'prCreate.stepProjectDetails': 'Project Details',
    'prCreate.stepReview': 'Quotes & Review',
    'prCreate.basicInfoTitle': 'Basic Information',
    'prCreate.basicInfoDescription': 'Provide the essential details for your purchase request',
    'prCreate.fieldTitle': 'Title *',
    'prCreate.fieldTitlePlaceholder': 'Enter request title',
    'prCreate.errorTitleMin': 'Title must be at least 3 characters',
    'prCreate.errorTitleMax': 'Title must be less than 120 characters',
    'prCreate.fieldCategory': 'Category *',
    'prCreate.fieldCategoryPlaceholder': 'Select category',
    'prCreate.errorCategoryRequired': 'Category is required',
    'prCreate.fieldDescription': 'Description',
    'prCreate.fieldDescriptionPlaceholder': 'Describe what you need and why',
    'prCreate.errorDescriptionMax': 'Description must be less than 5000 characters',
    'prCreate.fieldEstimatedCost': 'Estimated Cost *',
    'prCreate.fieldCostPlaceholder': '0.00',
    'prCreate.errorDesiredCost': 'Desired cost must be greater than 0',
    'prCreate.fieldCurrency': 'Currency *',
    'prCreate.fieldCurrencyPlaceholder': 'Select currency',
    'prCreate.fieldNeededByDate': 'Needed By Date *',
    'prCreate.errorNeededByDate': 'Date must be in the future',
    'prCreate.pickDate': 'Pick a date',
    'prCreate.itemsTitle': 'Items',
    'prCreate.itemsDescription': 'Add the specific items you need to purchase',
    'prCreate.item': 'Item',
    'prCreate.errorItemNameRequired': 'Item name is required',
    'prCreate.fieldItemName': 'Item Name *',
    'prCreate.fieldItemNamePlaceholder': 'Enter item name',
    'prCreate.fieldVendorHint': 'Vendor Hint',
    'prCreate.fieldVendorHintPlaceholder': 'Preferred vendor (optional)',
    'prCreate.fieldQuantity': 'Quantity *',
    'prCreate.errorQuantityMin': 'Quantity must be at least 1',
    'prCreate.fieldUnitPrice': 'Unit Price *',
    'prCreate.errorUnitPrice': 'Unit price must be greater than 0',
    'prCreate.fieldTotal': 'Total',
    'prCreate.addItem': 'Add Item',
    'prCreate.totalCost': 'Total Cost',
  'prCreate.errorAtLeastOneItem': 'At least one item is required',
    'prCreate.uploadQuotesTitle': 'Upload Quotes',
    'prCreate.uploadQuotesDescription': 'Upload vendor quotes or supporting documents (optional)',
    'prCreate.accountantQuotesOnly': 'Only accountants can upload vendor quotes. Quotes will be added by the accounting team during review.',
    'prCreate.quotesAddedByAccountant': 'Vendor quotes can only be added by the accounting team. They will review and add appropriate quotes during the approval process.',
    'prCreate.supportedFormats': 'Supported formats',
    'prCreate.reviewTitle': 'Review & Submit',
    'prCreate.reviewDescription': 'Please review your purchase request before submitting',
    'prCreate.reviewFieldTitle': 'Title',
    'prCreate.reviewFieldCategory': 'Category',
    'prCreate.reviewFieldEstimatedCost': 'Estimated Cost',
    'prCreate.reviewFieldNeededBy': 'Needed By',
    'prCreate.reviewFieldDescription': 'Description',
    'prCreate.reviewItems': 'Items',
    'prCreate.reviewTotal': 'Total',
    'prCreate.reviewUploadedFiles': 'Uploaded Files',
    'prCreate.buttonPrevious': 'Previous',
    'prCreate.buttonNext': 'Next',
    'prCreate.buttonSubmit': 'Create Purchase Request',
  'prCreate.categories.itEquipment': 'IT Equipment',
  'prCreate.categories.officeSupplies': 'Office Supplies',
  'prCreate.categories.softwareLicenses': 'Software Licenses',
  'prCreate.categories.marketingMaterials': 'Marketing Materials',
  'prCreate.categories.travelAccommodation': 'Travel & Accommodation',
  'prCreate.categories.professionalServices': 'Professional Services',
    'prCreate.categories.trainingDevelopment': 'Training & Development',
    'prCreate.categories.facilitiesMaintenance': 'Facilities & Maintenance',
    'prCreate.categories.other': 'Other',
    'prCreate.categories.softwareDevelopment': 'Software Development',
    'prCreate.categories.consultingServices': 'Consulting Services',
    'prCreate.categories.researchDevelopment': 'Research & Development',
    'prCreate.categories.infrastructureProjects': 'Infrastructure Projects',
    'prCreate.categories.digitalTransformation': 'Digital Transformation',

    // Request Type
    'prCreate.fieldRequestType': 'Request Type *',
    'prCreate.requestType.purchase': 'Purchase Request',
    'prCreate.requestType.project': 'Project Request',
    
    // Project specific fields
    'prCreate.fieldClientName': 'Client Name *',
    'prCreate.fieldClientNamePlaceholder': 'Enter client name',
    'prCreate.fieldProjectDescription': 'Project Description *',
    'prCreate.fieldProjectDescriptionPlaceholder': 'Describe the project details and requirements',
    'prCreate.fieldTotalCost': 'Total Cost *',
    'prCreate.fieldTotalBenefit': 'Total Benefit (ROI) *',
    'prCreate.fieldTotalPrice': 'Total Price *',
    'prCreate.projectDetailsTitle': 'Project Details',
    'prCreate.projectDetailsDescription': 'Provide specific details about the project',
    'prCreate.itemsDescriptionPurchase': 'Add the specific items you need to purchase',
    'prCreate.itemsDescriptionProject': 'Add any items needed for this project (optional)',
    'prCreate.projectItemsOptionalMessage': 'For projects, adding items is optional. You can continue without adding items if they are not applicable to your project request.',
    'prCreate.reviewProjectDetails': 'Project Details',
    'prCreate.requestType.label': 'Request Type',
    'prCreate.fieldBenefitPlaceholder': '0.00',
    'prCreate.fieldPricePlaceholder': '0.00',
    'prCreate.errorClientNameRequired': 'Client name is required',
    'prCreate.errorProjectDescriptionRequired': 'Project description is required',
    'prCreate.errorTotalCost': 'Total cost must be greater than 0',
    'prCreate.errorTotalBenefit': 'Total benefit must be a positive number',
    'prCreate.errorTotalPrice': 'Total price must be greater than 0',    // PR Details
    'prDetails.backToPRs': 'Back to PRs',
    'prDetails.prNumber': 'PR #',
    'prDetails.review': 'Review',
    'prDetails.reviewDialogTitle': 'Review Purchase Request',
    'prDetails.reviewDialogDescription': 'Please review and make a decision on this purchase request.',
    'prDetails.decision': 'Decision',
    'prDetails.selectDecision': 'Select decision',
    'prDetails.approve': 'Approve',
    'prDetails.reject': 'Reject',
    'prDetails.payoutChannel': 'Payout Channel',
    'prDetails.selectPayoutChannel': 'Select payout channel',
    'prDetails.payoutWallet': 'Digital Wallet',
    'prDetails.payoutCompany': 'Company Account',
    'prDetails.payoutCourier': 'Cash on Delivery',
    'prDetails.comment': 'Comment',
    'prDetails.commentPlaceholder': 'Add your comments...',
    'prDetails.commentRequired': 'Comment *',
    'prDetails.submitDecision': 'Submit Decision',
    'prDetails.markFundsTransferred': 'Mark Funds Transferred',
    'prDetails.fundsDialogTitle': 'Mark Funds as Transferred',
    'prDetails.fundsDialogDescription': 'Confirm that the funds have been transferred for this purchase request.',
    'prDetails.payoutReference': 'Payout Reference *',
    'prDetails.payoutReferencePlaceholder': 'Enter transaction reference',
    'prDetails.transferDate': 'Transfer Date *',
    'prDetails.markAsTransferred': 'Mark as Transferred',
    'prDetails.stepDraft': 'Draft',
    'prDetails.stepSubmitted': 'Submitted',
    'prDetails.stepManagerApproved': 'Manager Approved',
    'prDetails.stepAccountantApproved': 'Accountant Approved',
    'prDetails.stepFinalApproved': 'Final Approved',
    'prDetails.stepFundsTransferred': 'Funds Transferred',
    'prDetails.tabOverview': 'Overview',
    'prDetails.tabItems': 'Items',
    'prDetails.tabQuotes': 'Quotes',
    'prDetails.tabApprovals': 'Approvals',
    'prDetails.requestDetails': 'Request Details',
    'prDetails.category': 'Category',
    'prDetails.estimatedCost': 'Estimated Cost',
    'prDetails.neededBy': 'Needed By',
    'prDetails.created': 'Created',
    'prDetails.description': 'Description',
    'prDetails.itemsCount': 'Items ({count})',
    'prDetails.quantity': 'Quantity',
    'prDetails.unitPrice': 'Unit Price',
    'prDetails.vendorHint': 'Vendor Hint',
    'prDetails.total': 'Total',
    'prDetails.quotesCount': 'Vendor Quotes ({count})',
    'prDetails.vendorName': 'Vendor Name',
    'prDetails.quoteTotal': 'Total',
    'prDetails.uploaded': 'Uploaded',
    'prDetails.view': 'View',
    'prDetails.download': 'Download',
    'prDetails.noQuotes': 'No quotes uploaded yet',
    'prDetails.uploadQuote': 'Upload Vendor Quote',
    'prDetails.accountantQuotesOnly': 'Only accountants can upload vendor quotes',
    'prDetails.uploadQuoteDialogTitle': 'Upload Vendor Quote',
    'prDetails.uploadQuoteDialogDescription': 'Add a new vendor quote to this purchase request',
    'prDetails.vendorNamePlaceholder': 'Enter vendor name',
    'prDetails.submitQuote': 'Upload Quote',
    'prDetails.toast.quoteUploadSuccess': 'Quote from {vendor} uploaded successfully',
    'prDetails.toast.noQuoteFiles': 'Please select a quote file to upload',
    'prDetails.toast.fileTooLarge': 'File size exceeds the maximum limit of 5MB',
    'prDetails.approvalHistory': 'Approval History',
    'prDetails.stageApproval': '{stage} Approval',
  'prDetails.stage.DM': 'Direct Manager Approval',
  'prDetails.stage.ACCT': 'Accountant Approval',
  'prDetails.stage.FINAL': 'Final Approval',
    'prDetails.decided': 'Decided',
    'prDetails.pendingSince': 'Pending since',
    'prDetails.requester': 'Requester',
    'prDetails.currentApprover': 'Current Approver',
    'prDetails.quickActions': 'Quick Actions',
    'prDetails.exportPdf': 'Export PDF',
    'prDetails.addComment': 'Add Comment',
    'prDetails.editRequest': 'Edit Request',
  'prDetails.toast.approvalSuccess': 'Decision submitted successfully',
  'prDetails.toast.approvalError': 'Failed to process approval',
  'prDetails.toast.fundsSuccess': 'Funds marked as transferred successfully',
  'prDetails.toast.fundsError': 'Failed to mark funds as transferred',
  'prDetails.toast.downloadingQuote': 'Downloading {vendor} quote',
  'prDetails.payoutReferenceRequired': 'Payout reference is required',

    // Accounting
    'accounting.title': 'Accounting Dashboard',
    'accounting.subtitle': 'Manage financial approvals, transfers, and budgets',
    'accounting.period.currentMonth': 'Current Month',
    'accounting.period.lastMonth': 'Last Month',
    'accounting.period.quarter': 'This Quarter',
    'accounting.period.year': 'This Year',
    'accounting.exportReport': 'Export Report',
    'accounting.stats.pendingTransfers': 'Pending Transfers',
    'accounting.stats.monthlyBudgetUsed': 'Monthly Budget Used',
    'accounting.stats.approvedThisMonth': 'Approved This Month',
    'accounting.stats.activeDepartments': 'Active Departments',
    'accounting.stats.fromLastMonth': 'from last month',
    'accounting.tabs.transfers': 'Pending Transfers',
    'accounting.tabs.transactions': 'Recent Transactions',
    'accounting.tabs.budgets': 'Department Budgets',
    'accounting.tabs.reports': 'Reports',
    'accounting.transfers.title': 'Pending Fund Transfers',
    'accounting.transfers.description': 'Purchase requests approved and awaiting fund transfer',
    'accounting.transfers.approved': 'Approved',
    'accounting.transfers.transferFunds': 'Transfer Funds',
    'accounting.transactions.title': 'Recent Transactions',
    'accounting.transactions.description': 'Recently completed and pending fund transfers',
    'accounting.budgets.title': 'Department Budget Overview',
    'accounting.budgets.description': 'Current budget utilization by department',
    'accounting.budgets.utilized': 'utilized',
    'accounting.budgets.remaining': 'remaining',
    'accounting.reports.financialSummary.title': 'Financial Summary',
    'accounting.reports.financialSummary.description': 'Monthly financial overview',
    'accounting.reports.budgetAnalysis.title': 'Budget Analysis',
    'accounting.reports.budgetAnalysis.description': 'Department budget breakdown',
    'accounting.reports.transactionHistory.title': 'Transaction History',
    'accounting.reports.transactionHistory.description': 'Detailed transaction log',
    'accounting.reports.generate': 'Generate Report',
  'accounting.toast.transferInitiated': 'Initiating fund transfer for {id}',
  'accounting.toast.reportGenerating': 'Generating {type} report... ',

    // Admin Users
    'admin.users.title': 'User Management',
    'admin.users.subtitle': 'Manage system users, roles, and permissions',
    'admin.users.addUser': 'Add User',
    'admin.users.createDialog.title': 'Create New User',
    'admin.users.createDialog.description': 'Add a new user to the system with appropriate role and permissions.',
    'admin.users.createDialog.fullName': 'Full Name',
    'admin.users.createDialog.fullNamePlaceholder': 'Enter full name',
    'admin.users.createDialog.email': 'Email Address',
    'admin.users.createDialog.emailPlaceholder': 'Enter email address',
    'admin.users.createDialog.role': 'Role',
    'admin.users.createDialog.createUser': 'Create User',
    'admin.users.stats.total': 'Total Users',
    'admin.users.stats.active': 'Active Users',
    'admin.users.stats.inactive': 'Inactive Users',
    'admin.users.stats.admins': 'Admins',
    'admin.users.list.title': 'Users',
    'admin.users.list.subtitle': 'Manage user accounts and their access levels',
    'admin.users.list.searchPlaceholder': 'Search users...',
    'admin.users.list.filterRole': 'Filter by role',
    'admin.users.list.filterStatus': 'Filter by status',
    'admin.users.list.allRoles': 'All Roles',
    'admin.users.list.allStatuses': 'All Status',
    'admin.users.list.statusActive': 'Active',
    'admin.users.list.statusInactive': 'Inactive',
    'admin.users.list.lastLogin': 'Last login',
    'admin.users.list.never': 'Never',
    'admin.users.editDialog.title': 'Edit User',
    'admin.users.editDialog.description': 'Update user information and permissions.',
    'admin.users.editDialog.save': 'Save Changes',
  'admin.users.toast.created': 'User {name} created successfully!',
  'admin.users.toast.deleted': 'User deleted successfully!',
  'admin.users.toast.statusUpdated': 'User status updated!',
  'admin.users.toast.updated': 'User updated successfully!',

    // Admin Settings
    'admin.settings.title': 'System Settings',
    'admin.settings.subtitle': 'Configure system-wide settings and preferences',
    'admin.settings.saveButton': 'Save All Changes',
    'admin.settings.saveSuccess': 'Settings saved successfully!',

    'admin.settings.tabs.general': 'General',
    'admin.settings.tabs.approval': 'Approval',
    'admin.settings.tabs.notifications': 'Notifications',
    'admin.settings.tabs.security': 'Security',
    'admin.settings.tabs.integrations': 'Integrations',

    'admin.settings.general.title': 'General Settings',
    'admin.settings.general.description': 'Basic system configuration and company information',
    'admin.settings.general.companyName': 'Company Name',
    'admin.settings.general.companyEmail': 'Company Email',
    'admin.settings.general.timezone': 'Timezone',
    'admin.settings.general.currency': 'Default Currency',

    'admin.settings.timezones.new_york': 'Eastern Time',
    'admin.settings.timezones.chicago': 'Central Time',
    'admin.settings.timezones.denver': 'Mountain Time',
    'admin.settings.timezones.los_angeles': 'Pacific Time',
    'admin.settings.timezones.london': 'London',
    'admin.settings.timezones.berlin': 'Berlin',
    'admin.settings.timezones.tokyo': 'Tokyo',

    'admin.settings.currencies.usd': 'USD - US Dollar',
    'admin.settings.currencies.eur': 'EUR - Euro',
    'admin.settings.currencies.gbp': 'GBP - British Pound',
    'admin.settings.currencies.cad': 'CAD - Canadian Dollar',
    'admin.settings.currencies.aud': 'AUD - Australian Dollar',

    'admin.settings.approval.title': 'Approval Workflow Settings',
    'admin.settings.approval.description': 'Configure approval thresholds and workflow requirements',
    'admin.settings.approval.autoApprovalThreshold': 'Auto-Approval Threshold',
    'admin.settings.approval.autoApprovalThresholdHint': 'Requests below this amount are auto-approved',
    'admin.settings.approval.requireManagerApproval': 'Require Manager Approval',
    'admin.settings.approval.requireManagerApprovalHint': 'All requests must be approved by direct manager',
    'admin.settings.approval.requireAccountantApproval': 'Require Accountant Approval',
    'admin.settings.approval.requireAccountantApprovalHint': 'Requests above threshold require accountant approval',
    'admin.settings.approval.requireFinalManagerApproval': 'Require Final Manager Approval',
    'admin.settings.approval.requireFinalManagerApprovalHint': 'High-value requests require final manager approval',
    'admin.settings.approval.approvalTimeout': 'Approval Timeout (Days)',
    'admin.settings.approval.approvalTimeoutHint': 'Auto-escalate if no response within this period',

    'admin.settings.notifications.title': 'Notification Settings',
    'admin.settings.notifications.description': 'Configure how and when users receive notifications',
    'admin.settings.notifications.emailNotifications': 'Email Notifications',
    'admin.settings.notifications.emailNotificationsHint': 'Send notifications via email',
    'admin.settings.notifications.slackIntegration': 'Slack Integration',
    'admin.settings.notifications.slackIntegrationHint': 'Send notifications to Slack channels',
    'admin.settings.notifications.reminderFrequency': 'Reminder Frequency',
    'admin.settings.notifications.triggersTitle': 'Notification Triggers',
    'admin.settings.notifications.onSubmission': 'PR Submission',
    'admin.settings.notifications.onSubmissionHint': 'Notify when new PR is submitted',
    'admin.settings.notifications.onApproval': 'PR Approval',
    'admin.settings.notifications.onApprovalHint': 'Notify when PR is approved',
    'admin.settings.notifications.onRejection': 'PR Rejection',
    'admin.settings.notifications.onRejectionHint': 'Notify when PR is rejected',

    'admin.settings.frequencies.never': 'Never',
    'admin.settings.frequencies.daily': 'Daily',
    'admin.settings.frequencies.weekly': 'Weekly',
    'admin.settings.frequencies.monthly': 'Monthly',
    'admin.settings.frequencies.hourly': 'Hourly',

    'admin.settings.security.title': 'Security Settings',
    'admin.settings.security.description': 'Configure security policies and file upload restrictions',
    'admin.settings.security.sessionTimeout': 'Session Timeout (Minutes)',
    'admin.settings.security.passwordMinLength': 'Minimum Password Length',
    'admin.settings.security.requireMFA': 'Require Multi-Factor Authentication',
    'admin.settings.security.requireMFAHint': 'Require MFA for all user accounts',
    'admin.settings.security.allowedFileTypes': 'Allowed File Types',
    'admin.settings.security.allowedFileTypesHint': 'Comma-separated list of allowed file extensions',
    'admin.settings.security.maxFileSize': 'Maximum File Size (MB)',

    'admin.settings.integrations.title': 'System Integrations',
    'admin.settings.integrations.description': 'Configure external system integrations and data backups',
    'admin.settings.integrations.erpIntegration': 'ERP Integration',
    'admin.settings.integrations.erpIntegrationHint': 'Connect to external ERP system',
    'admin.settings.integrations.erpApiEndpoint': 'ERP API Endpoint',
    'admin.settings.integrations.erpApiKey': 'ERP API Key',
    'admin.settings.integrations.erpApiKeyPlaceholder': 'Enter API key',
    'admin.settings.integrations.backupFrequency': 'Backup Frequency',
    'admin.settings.integrations.maintenanceTitle': 'System Maintenance',
    'admin.settings.integrations.backupDb': 'Backup Database',
    'admin.settings.integrations.exportLog': 'Export Audit Log',
    'admin.settings.integrations.syncDir': 'Sync User Directory',
    'admin.settings.integrations.healthCheck': 'System Health Check',

    // Login Page
    'login.title': 'Sign in to your account',
    'login.subtitle': 'Purchase Request Management System',
    'login.welcome': 'Welcome back',
    'login.welcomeSubtitle': 'Enter your credentials to access your account',
    'login.emailLabel': 'Email address',
    'login.emailPlaceholder': 'Enter your email',
    'login.passwordLabel': 'Password',
    'login.passwordPlaceholder': 'Enter your password',
    'login.rememberMe': 'Remember me',
    'login.forgotPassword': 'Forgot your password?',
    'login.signInButton': 'Sign in',
    'login.signingInButton': 'Signing in...',
    'login.demoCredentials': 'Demo Credentials',
    'login.demo.admin': 'Admin:',
    'login.demo.manager': 'Manager:',
    'login.demo.accountant': 'Accountant:',
    'login.demo.user': 'User:',
    'login.demo.password': 'any password',
    'login.errors.invalidEmail': 'Please enter a valid email address',
    'login.errors.passwordRequired': 'Password is required',

    // Not Found Page
    'notfound.title': '404',
    'notfound.message': 'Oops! Page not found',
    'notfound.link': 'Return to Home',

    // Statuses
    'status.DRAFT': 'Draft',
    'status.PENDING': 'Pending',
    'status.REJECTED': 'Rejected',
    'status.APPROVED': 'Approved',
    'status.SUBMITTED': 'Submitted',
    'status.DM_APPROVED': 'DM Approved',
    'status.ACCT_APPROVED': 'Accountant Approved',
    'status.FINAL_APPROVED': 'Final Approved',
    'status.FUNDS_TRANSFERRED': 'Funds Transferred',

    // Roles
    'roles.USER': 'User',
    'roles.MANAGER': 'Manager',
    'roles.ACCOUNTANT': 'Accountant',
    'roles.ADMIN': 'Admin',
    'roles.DIRECT_MANAGER': 'Direct Manager',
    'roles.FINAL_MANAGER': 'Final Manager',

    // Unauthorized Page
    'unauthorized.title': 'Access Denied',
    'unauthorized.message': "You don't have permission to access this page. Please contact your administrator if you believe this is an error.",
    'unauthorized.back': 'Back to Dashboard',

    // PR Store Toasts
    'pr.toast.createSuccess': 'Purchase request created successfully!',
    'pr.toast.createError': 'Failed to create purchase request',
    'pr.toast.updateSuccess': 'Purchase request updated successfully!',
    'pr.toast.updateError': 'Failed to update purchase request',
    'pr.toast.deleteSuccess': 'Purchase request deleted successfully!',
    'pr.toast.deleteError': 'Failed to delete purchase request',
    'pr.toast.fetchError': 'Failed to fetch purchase requests',
    'pr.toast.approveSuccess': 'Purchase request approved successfully!',
    'pr.toast.approveError': 'Failed to approve purchase request',
    'pr.toast.rejectSuccess': 'Purchase request rejected',
    'pr.toast.rejectError': 'Failed to reject purchase request',

    // Auth Toasts
    'auth.toast.welcomeBack': 'Welcome back, {name}!',
    'auth.toast.logoutSuccess': 'Logged out successfully',
    
    // Notifications
    'notifications.markAllRead': 'Mark all read',
    'notifications.viewAll': 'View all notifications',
    'notifications.empty': 'No notifications',
    'notifications.time.minutes': '{value} minutes ago',
    'notifications.time.hours': '{value} hour(s) ago',
    'notifications.time.days': '{value} day(s) ago',
    'notifications.approval.title': 'Purchase Request Needs Approval',
    'notifications.approval.message': 'PR-2024-001: Office Supplies requires your approval',
    'notifications.approved.title': 'Purchase Request Approved',
    'notifications.approved.message': 'Your request for Marketing Materials has been approved',
    'notifications.rejected.title': 'Purchase Request Rejected',
    'notifications.rejected.message': 'PR-2024-003: Equipment Purchase was rejected',
    'notifications.assignment.title': 'New Assignment',
    'notifications.assignment.message': 'You have been assigned as approver for IT Equipment',
    'notifications.reminder.title': 'Pending Approval Reminder',
    'notifications.reminder.message': 'You have 2 pending approvals that need attention',

    // Approvals Page
    'approvals.stats.urgentWithin3Days': 'Due within 3 days',
    'approvals.labels.sla': 'SLA',
    'approvals.labels.id': 'ID',
    'approvals.labels.due': 'Due',
    'approvals.empty.title': 'No pending approvals',
    'approvals.empty.filtered': 'No requests match your current filters.',
    'approvals.empty.allCaughtUp': 'All caught up! No purchase requests require your approval at this time.',
  },
  ar: {
    // App
    'app.title': 'نظام طلبات الشراء',
    
    // Navigation
    'nav.dashboard': 'لوحة التحكم',
    'nav.myPRs': 'طلباتي',
    'nav.createPR': 'إنشاء طلب',
    'nav.approvals': 'الموافقات',
    'nav.accounting': 'المحاسبة',
    'nav.reports': 'التقارير',
    'nav.users': 'المستخدمين',
    'nav.settings': 'الإعدادات',
    'nav.newRequest': 'طلب جديد',
    'nav.profile': 'إعدادات الملف الشخصي',
    'nav.notifications': 'الإشعارات',
    'nav.logout': 'تسجيل الخروج',
    
    // Dashboard
    'dashboard.welcome': 'مرحباً بعودتك',
    'dashboard.subtitle': 'إليك ما يحدث مع طلبات الشراء الخاصة بك اليوم.',
    'dashboard.totalPRs': 'إجمالي الطلبات',
    'dashboard.pendingApprovals': 'الموافقات المعلقة',
    'dashboard.approvedThisMonth': 'الموافق عليها هذا الشهر',
    'dashboard.budgetUtilization': 'استخدام الميزانية',
    'dashboard.requiresAttention': 'تتطلب انتباهك',
    'dashboard.fromLastMonth': 'من الشهر الماضي',
    'dashboard.approachingBudget': 'تقترب من حد الميزانية',
    'dashboard.recentRequests': 'الطلبات الحديثة',
    'dashboard.recentActivity': 'النشاط الأخير',
    'dashboard.viewAll': 'عرض الكل',
    'dashboard.view': 'عرض',
    'dashboard.insights': 'الرؤى',
    'dashboard.approvalRate': 'معدل الموافقة',
    'dashboard.budgetAlert': 'تنبيه الميزانية',
    'dashboard.performance': 'الأداء',
    'dashboard.quickActions': 'الإجراءات السريعة',
    'dashboard.createNewRequest': 'إنشاء طلب جديد',
    'dashboard.reviewPending': 'مراجعة المعلق',
    'dashboard.myRequests': 'طلباتي',
  'dashboard.approvalRateDesc': 'تمت الموافقة على 92% من الطلبات هذا الشهر (+5% مقارنة بالشهر الماضي)',
  'dashboard.budgetAlertDesc': 'ميزانية الفريق مستخدمة بنسبة 78% لهذا الربع',
  'dashboard.performanceDesc': 'انخفض متوسط وقت الموافقة بمقدار يومين',
  'dashboard.filters.allRequests': 'جميع الطلبات',
  'dashboard.filters.purchaseRequests': 'طلبات الشراء',
  'dashboard.filters.projectRequests': 'طلبات المشاريع',
  'dashboard.requestType.purchase': 'شراء',
  'dashboard.requestType.project': 'مشروع',
  'dashboard.totalProjects': 'إجمالي المشاريع',
  'dashboard.totalProjectValue': 'قيمة المشروع',
  'dashboard.totalProjectBenefit': 'فائدة المشروع',
  'dashboard.projectsCompletionRate': 'معدل الإكمال',
  'dashboard.activeProjects': 'المشاريع النشطة',
  'dashboard.estimatedValue': 'القيمة الإجمالية المقدرة',
  'dashboard.projectedBenefit': 'العائد المتوقع على الاستثمار',
  'dashboard.client': 'العميل',
  'dashboard.featuredInsights': 'رؤى مميزة',
  'dashboard.performanceMetrics': 'مقاييس الأداء',
  'dashboard.performanceMetricsDesc': 'مؤشرات الأداء الرئيسية والاتجاهات',
  'dashboard.resourceAllocation': 'تخصيص الموارد',
  'dashboard.resourceAllocationDesc': 'تخصيص الميزانية وإدارة الموارد',
  'dashboard.approvalEfficiency': 'كفاءة الموافقة',
  'dashboard.costOptimization': 'تحسين التكلفة',
  'dashboard.userSatisfaction': 'رضا المستخدم',
  'dashboard.viewDetailedAnalytics': 'عرض تحليلات مفصلة',
  'dashboard.totalBudget': 'إجمالي الميزانية',
  'dashboard.availableFunds': 'الأموال المتاحة',
  'dashboard.completedRequests': 'الطلبات المكتملة',
  'dashboard.avgProcessTime': 'متوسط وقت المعالجة',
  'dashboard.days': 'أيام',
  'dashboard.budgetForecast': 'توقعات الميزانية',
  'dashboard.budgetForecastDesc': 'بناءً على الإنفاق الحالي، من المتوقع أن تظل أقل من الميزانية بنسبة 12٪ لهذا الربع.',
  'dashboard.viewResourceDashboard': 'عرض لوحة تحكم الموارد',
    
    // Reports
    'reports.title': 'التقارير',
    'reports.subtitle': 'رؤى وتحليلات المدير',
    'reports.exportCSV': 'تصدير CSV',
    'reports.filters': 'المرشحات',
    'reports.status': 'الحالة',
    'reports.from': 'من',
    'reports.to': 'إلى',
    'reports.totalSubmitted': 'إجمالي المقدم',
    'reports.totalApproved': 'إجمالي الموافق عليه',
    'reports.totalSpend': 'إجمالي الإنفاق',
    'reports.approvalRate': 'معدل الموافقة',
    'reports.prVolumeByMonth': 'حجم الطلبات بالشهر',
    'reports.spendByCategory': 'الإنفاق حسب الفئة',
    'reports.topRequesters': 'أكثر مقدمي الطلبات',
    'reports.name': 'الاسم',
    'reports.requests': 'الطلبات',
    'reports.totalSpendCol': 'إجمالي الإنفاق',
    
    // Common
    'common.status': 'الحالة',
    'common.all': 'الكل',
    'common.submitted': 'مقدم',
    'common.approved': 'موافق عليه',
    'common.rejected': 'مرفوض',
    'common.pending': 'معلق',
    'common.search': 'بحث',
    'common.filter': 'مرشح',
    'common.export': 'تصدير',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.edit': 'تعديل',
    'common.delete': 'حذف',
    'common.view': 'عرض',
    'common.create': 'إنشاء',
    'common.update': 'تحديث',
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.warning': 'تحذير',
    'common.info': 'معلومات',
    'common.close': 'إغلاق',
    'common.back': 'رجوع',
    'common.next': 'التالي',
    'common.previous': 'السابق',
    'common.yes': 'نعم',
    'common.no': 'لا',
    'common.confirm': 'تأكيد',
    'common.logout': 'تسجيل الخروج',
    'common.profile': 'إعدادات الملف الشخصي',
    'common.notifications': 'الإشعارات',
  'common.searchPlaceholder': 'ابحث في طلبات الشراء...',
  'common.reset': 'إعادة تعيين',
    'common.by': 'بواسطة',
  'common.priority.high': 'عالي',
  'common.priority.medium': 'متوسط',
  'common.priority.low': 'منخفض',
    
    // PR Create
    'prCreate.backToPRs': 'العودة إلى طلبات الشراء',
    'prCreate.title': 'إنشاء طلب شراء',
    'prCreate.subtitle': 'املأ النموذج لإنشاء طلب شراء جديد',
    'prCreate.stepBasicInfo': 'المعلومات الأساسية',
    'prCreate.stepItems': 'البنود',
    'prCreate.stepProjectDetails': 'تفاصيل المشروع',
    'prCreate.stepReview': 'عروض الأسعار والمراجعة',
    'prCreate.basicInfoTitle': 'المعلومات الأساسية',
    'prCreate.basicInfoDescription': 'قدم التفاصيل الأساسية لطلب الشراء الخاص بك',
    'prCreate.fieldTitle': 'العنوان *',
    'prCreate.fieldTitlePlaceholder': 'أدخل عنوان الطلب',
    'prCreate.errorTitleMin': 'يجب أن يتكون العنوان من 3 أحرف على الأقل',
    'prCreate.errorTitleMax': 'يجب أن يكون العنوان أقل من 120 حرفًا',
    'prCreate.fieldCategory': 'الفئة *',
    'prCreate.fieldCategoryPlaceholder': 'اختر الفئة',
    'prCreate.errorCategoryRequired': 'الفئة مطلوبة',
    'prCreate.fieldDescription': 'الوصف',
    'prCreate.fieldDescriptionPlaceholder': 'صف ما تحتاجه ولماذا',
    'prCreate.errorDescriptionMax': 'يجب أن يكون الوصف أقل من 5000 حرف',
    'prCreate.fieldEstimatedCost': 'التكلفة التقديرية *',
    'prCreate.fieldCostPlaceholder': '0.00',
    'prCreate.errorDesiredCost': 'يجب أن تكون التكلفة المرغوبة أكبر من 0',
    'prCreate.fieldCurrency': 'العملة *',
    'prCreate.fieldCurrencyPlaceholder': 'اختر العملة',
    'prCreate.fieldNeededByDate': 'تاريخ الحاجة *',
    'prCreate.errorNeededByDate': 'يجب أن يكون التاريخ في المستقبل',
    'prCreate.pickDate': 'اختر تاريخًا',
    'prCreate.itemsTitle': 'البنود',
    'prCreate.itemsDescription': 'أضف البنود المحددة التي تحتاج إلى شرائها',
    'prCreate.item': 'بند',
    'prCreate.errorItemNameRequired': 'اسم البند مطلوب',
    'prCreate.fieldItemName': 'اسم البند *',
    'prCreate.fieldItemNamePlaceholder': 'أدخل اسم البند',
    'prCreate.fieldVendorHint': 'تلميح المورد',
    'prCreate.fieldVendorHintPlaceholder': 'المورد المفضل (اختياري)',
    'prCreate.fieldQuantity': 'الكمية *',
    'prCreate.errorQuantityMin': 'يجب أن تكون الكمية 1 على الأقل',
    'prCreate.fieldUnitPrice': 'سعر الوحدة *',
    'prCreate.errorUnitPrice': 'يجب أن يكون سعر الوحدة أكبر من 0',
    'prCreate.fieldTotal': 'الإجمالي',
    'prCreate.addItem': 'إضافة بند',
    'prCreate.totalCost': 'التكلفة الإجمالية',
  'prCreate.errorAtLeastOneItem': 'مطلوب عنصر واحد على الأقل',
    'prCreate.uploadQuotesTitle': 'تحميل عروض الأسعار',
    'prCreate.uploadQuotesDescription': 'قم بتحميل عروض أسعار الموردين أو المستندات الداعمة (اختياري)',
    'prCreate.accountantQuotesOnly': 'يمكن للمحاسبين فقط تحميل عروض أسعار الموردين. سيتم إضافة عروض الأسعار بواسطة فريق المحاسبة أثناء المراجعة.',
    'prCreate.quotesAddedByAccountant': 'يمكن إضافة عروض أسعار الموردين فقط بواسطة فريق المحاسبة. سيقومون بالمراجعة وإضافة العروض المناسبة خلال عملية الموافقة.',
    'prCreate.supportedFormats': 'التنسيقات المدعومة',
    'prCreate.reviewTitle': 'مراجعة وتقديم',
    'prCreate.reviewDescription': 'يرجى مراجعة طلب الشراء الخاص بك قبل التقديم',
    'prCreate.reviewFieldTitle': 'العنوان',
    'prCreate.reviewFieldCategory': 'الفئة',
    'prCreate.reviewFieldEstimatedCost': 'التكلفة التقديرية',
    'prCreate.reviewFieldNeededBy': 'مطلوب بحلول',
    'prCreate.reviewFieldDescription': 'الوصف',
    'prCreate.reviewItems': 'البنود',
    'prCreate.reviewTotal': 'الإجمالي',
    'prCreate.reviewUploadedFiles': 'الملفات المرفوعة',
    'prCreate.buttonPrevious': 'السابق',
    'prCreate.buttonNext': 'التالي',
    'prCreate.buttonSubmit': 'إنشاء طلب شراء',
  'prCreate.categories.itEquipment': 'معدات تقنية المعلومات',
  'prCreate.categories.officeSupplies': 'مستلزمات المكاتب',
  'prCreate.categories.softwareLicenses': 'تراخيص البرامج',
  'prCreate.categories.marketingMaterials': 'مواد تسويقية',
  'prCreate.categories.travelAccommodation': 'السفر والإقامة',
  'prCreate.categories.professionalServices': 'خدمات احترافية',
  'prCreate.categories.trainingDevelopment': 'التدريب والتطوير',
  'prCreate.categories.facilitiesMaintenance': 'المرافق والصيانة',
  'prCreate.categories.other': 'أخرى',
  'prCreate.categories.softwareDevelopment': 'تطوير البرمجيات',
  'prCreate.categories.consultingServices': 'خدمات استشارية',
  'prCreate.categories.researchDevelopment': 'البحث والتطوير',
  'prCreate.categories.infrastructureProjects': 'مشاريع البنية التحتية',
  'prCreate.categories.digitalTransformation': 'التحول الرقمي',

  // Request Type
  'prCreate.fieldRequestType': 'نوع الطلب *',
  'prCreate.requestType.purchase': 'طلب شراء',
  'prCreate.requestType.project': 'طلب مشروع',
  
  // Project specific fields
  'prCreate.fieldClientName': 'اسم العميل *',
  'prCreate.fieldClientNamePlaceholder': 'أدخل اسم العميل',
  'prCreate.fieldProjectDescription': 'وصف المشروع *',
  'prCreate.fieldProjectDescriptionPlaceholder': 'وصف تفاصيل المشروع ومتطلباته',
  'prCreate.fieldTotalCost': 'التكلفة الإجمالية *',
  'prCreate.fieldTotalBenefit': 'الفائدة الإجمالية (العائد على الاستثمار) *',
  'prCreate.fieldTotalPrice': 'السعر الإجمالي *',
  'prCreate.projectDetailsTitle': 'تفاصيل المشروع',
  'prCreate.projectDetailsDescription': 'قدم تفاصيل محددة عن المشروع',
  'prCreate.itemsDescriptionPurchase': 'أضف العناصر المحددة التي تحتاج إلى شرائها',
  'prCreate.itemsDescriptionProject': 'أضف أي عناصر مطلوبة لهذا المشروع (اختياري)',
  'prCreate.projectItemsOptionalMessage': 'بالنسبة للمشاريع، إضافة العناصر اختيارية. يمكنك المتابعة دون إضافة عناصر إذا كانت غير قابلة للتطبيق على طلب المشروع الخاص بك.',
  'prCreate.reviewProjectDetails': 'تفاصيل المشروع',
  'prCreate.requestType.label': 'نوع الطلب',
  'prCreate.fieldBenefitPlaceholder': '0.00',
  'prCreate.fieldPricePlaceholder': '0.00',
  'prCreate.errorClientNameRequired': 'اسم العميل مطلوب',
  'prCreate.errorProjectDescriptionRequired': 'وصف المشروع مطلوب',
  'prCreate.errorTotalCost': 'يجب أن تكون التكلفة الإجمالية أكبر من 0',
  'prCreate.errorTotalBenefit': 'يجب أن يكون إجمالي الفائدة رقمًا موجبًا',
  'prCreate.errorTotalPrice': 'يجب أن يكون السعر الإجمالي أكبر من 0',

    // PR Details
    'prDetails.backToPRs': 'العودة إلى طلبات الشراء',
    'prDetails.prNumber': 'طلب شراء #',
    'prDetails.review': 'مراجعة',
    'prDetails.reviewDialogTitle': 'مراجعة طلب الشراء',
    'prDetails.reviewDialogDescription': 'يرجى مراجعة واتخاذ قرار بشأن طلب الشراء هذا.',
    'prDetails.decision': 'القرار',
    'prDetails.selectDecision': 'اختر القرار',
    'prDetails.approve': 'موافقة',
    'prDetails.reject': 'رفض',
    'prDetails.payoutChannel': 'قناة الدفع',
    'prDetails.selectPayoutChannel': 'اختر قناة الدفع',
    'prDetails.payoutWallet': 'محفظة رقمية',
    'prDetails.payoutCompany': 'حساب الشركة',
    'prDetails.payoutCourier': 'الدفع عند الاستلام',
    'prDetails.comment': 'تعليق',
    'prDetails.commentPlaceholder': 'أضف تعليقاتك...',
    'prDetails.commentRequired': 'تعليق *',
    'prDetails.submitDecision': 'إرسال القرار',
    'prDetails.markFundsTransferred': 'وضع علامة على تحويل الأموال',
    'prDetails.fundsDialogTitle': 'وضع علامة على الأموال المحولة',
    'prDetails.fundsDialogDescription': 'تأكيد أنه تم تحويل الأموال لطلب الشراء هذا.',
    'prDetails.payoutReference': 'مرجع الدفع *',
    'prDetails.payoutReferencePlaceholder': 'أدخل مرجع المعاملة',
    'prDetails.transferDate': 'تاريخ التحويل *',
    'prDetails.markAsTransferred': 'وضع علامة كمحول',
    'prDetails.stepDraft': 'مسودة',
    'prDetails.stepSubmitted': 'مقدم',
    'prDetails.stepManagerApproved': 'موافقة المدير',
    'prDetails.stepAccountantApproved': 'موافقة المحاسب',
    'prDetails.stepFinalApproved': 'موافقة نهائية',
    'prDetails.stepFundsTransferred': 'الأموال المحولة',
    'prDetails.tabOverview': 'نظرة عامة',
    'prDetails.tabItems': 'البنود',
    'prDetails.tabQuotes': 'عروض الأسعار',
    'prDetails.tabApprovals': 'الموافقات',
    'prDetails.requestDetails': 'تفاصيل الطلب',
    'prDetails.category': 'الفئة',
    'prDetails.estimatedCost': 'التكلفة التقديرية',
    'prDetails.neededBy': 'مطلوب بحلول',
    'prDetails.created': 'تم إنشاؤه',
    'prDetails.description': 'الوصف',
    'prDetails.itemsCount': 'البنود ({count})',
    'prDetails.quantity': 'الكمية',
    'prDetails.unitPrice': 'سعر الوحدة',
    'prDetails.vendorHint': 'تلميح المورد',
    'prDetails.total': 'الإجمالي',
    'prDetails.quotesCount': 'عروض أسعار الموردين ({count})',
    'prDetails.vendorName': 'اسم المورد',
    'prDetails.quoteTotal': 'الإجمالي',
    'prDetails.uploaded': 'تم الرفع',
    'prDetails.view': 'عرض',
    'prDetails.download': 'تنزيل',
    'prDetails.noQuotes': 'لم يتم رفع عروض أسعار بعد',
    'prDetails.uploadQuote': 'تحميل عرض سعر المورد',
    'prDetails.accountantQuotesOnly': 'يمكن للمحاسبين فقط تحميل عروض أسعار الموردين',
    'prDetails.uploadQuoteDialogTitle': 'تحميل عرض سعر المورد',
    'prDetails.uploadQuoteDialogDescription': 'إضافة عرض سعر جديد لطلب الشراء هذا',
    'prDetails.vendorNamePlaceholder': 'أدخل اسم المورد',
    'prDetails.submitQuote': 'تحميل عرض السعر',
    'prDetails.toast.quoteUploadSuccess': 'تم تحميل عرض سعر {vendor} بنجاح',
    'prDetails.toast.noQuoteFiles': 'يرجى تحديد ملف عرض السعر للتحميل',
    'prDetails.toast.fileTooLarge': 'حجم الملف يتجاوز الحد الأقصى البالغ 5 ميجابايت',
    'prDetails.approvalHistory': 'سجل الموافقات',
    'prDetails.stageApproval': 'موافقة {stage}',
  'prDetails.stage.DM': 'موافقة المدير المباشر',
  'prDetails.stage.ACCT': 'موافقة المحاسب',
  'prDetails.stage.FINAL': 'موافقة نهائية',
    'prDetails.decided': 'تم اتخاذ القرار',
    'prDetails.pendingSince': 'معلق منذ',
    'prDetails.requester': 'مقدم الطلب',
    'prDetails.currentApprover': 'الموافق الحالي',
    'prDetails.quickActions': 'إجراءات سريعة',
    'prDetails.exportPdf': 'تصدير PDF',
    'prDetails.addComment': 'إضافة تعليق',
    'prDetails.editRequest': 'تعديل الطلب',
  'prDetails.toast.approvalSuccess': 'تم إرسال القرار بنجاح',
  'prDetails.toast.approvalError': 'فشل في معالجة الموافقة',
  'prDetails.toast.fundsSuccess': 'تم وضع علامة على تحويل الأموال بنجاح',
  'prDetails.toast.fundsError': 'فشل وضع علامة على تحويل الأموال',
  'prDetails.toast.downloadingQuote': 'جاري تنزيل عرض {vendor}',
  'prDetails.payoutReferenceRequired': 'مرجع الدفع مطلوب',

    // Accounting
    'accounting.title': 'لوحة تحكم المحاسبة',
    'accounting.subtitle': 'إدارة الموافقات المالية والتحويلات والميزانيات',
    'accounting.period.currentMonth': 'الشهر الحالي',
    'accounting.period.lastMonth': 'الشهر الماضي',
    'accounting.period.quarter': 'هذا الربع',
    'accounting.period.year': 'هذه السنة',
    'accounting.exportReport': 'تصدير تقرير',
    'accounting.stats.pendingTransfers': 'التحويلات المعلقة',
    'accounting.stats.monthlyBudgetUsed': 'الميزانية الشهرية المستخدمة',
    'accounting.stats.approvedThisMonth': 'الموافق عليه هذا الشهر',
    'accounting.stats.activeDepartments': 'الأقسام النشطة',
    'accounting.stats.fromLastMonth': 'من الشهر الماضي',
    'accounting.tabs.transfers': 'التحويلات المعلقة',
    'accounting.tabs.transactions': 'المعاملات الأخيرة',
    'accounting.tabs.budgets': 'ميزانيات الأقسام',
    'accounting.tabs.reports': 'التقارير',
    'accounting.transfers.title': 'تحويلات الأموال المعلقة',
    'accounting.transfers.description': 'طلبات الشراء الموافق عليها وفي انتظار تحويل الأموال',
    'accounting.transfers.approved': 'موافق عليه',
    'accounting.transfers.transferFunds': 'تحويل الأموال',
    'accounting.transactions.title': 'المعاملات الأخيرة',
    'accounting.transactions.description': 'التحويلات المكتملة والمعلقة مؤخراً',
    'accounting.budgets.title': 'نظرة عامة على ميزانية القسم',
    'accounting.budgets.description': 'الاستخدام الحالي للميزانية حسب القسم',
    'accounting.budgets.utilized': 'مستخدم',
    'accounting.budgets.remaining': 'متبقي',
    'accounting.reports.financialSummary.title': 'ملخص مالي',
    'accounting.reports.financialSummary.description': 'نظرة عامة مالية شهرية',
    'accounting.reports.budgetAnalysis.title': 'تحليل الميزانية',
    'accounting.reports.budgetAnalysis.description': 'تفصيل ميزانية القسم',
    'accounting.reports.transactionHistory.title': 'سجل المعاملات',
    'accounting.reports.transactionHistory.description': 'سجل معاملات مفصل',
    'accounting.reports.generate': 'إنشاء تقرير',
  'accounting.toast.transferInitiated': 'بدء تحويل الأموال للطلب {id}',
  'accounting.toast.reportGenerating': 'جارٍ إنشاء تقرير {type}... ',

    // Admin Users
    'admin.users.title': 'إدارة المستخدمين',
    'admin.users.subtitle': 'إدارة مستخدمي النظام والأدوار والأذونات',
    'admin.users.addUser': 'إضافة مستخدم',
    'admin.users.createDialog.title': 'إنشاء مستخدم جديد',
    'admin.users.createDialog.description': 'أضف مستخدمًا جديدًا إلى النظام بالدور والأذونات المناسبة.',
    'admin.users.createDialog.fullName': 'الاسم الكامل',
    'admin.users.createDialog.fullNamePlaceholder': 'أدخل الاسم الكامل',
    'admin.users.createDialog.email': 'عنوان البريد الإلكتروني',
    'admin.users.createDialog.emailPlaceholder': 'أدخل عنوان البريد الإلكتروني',
    'admin.users.createDialog.role': 'الدور',
    'admin.users.createDialog.createUser': 'إنشاء مستخدم',
    'admin.users.stats.total': 'إجمالي المستخدمين',
    'admin.users.stats.active': 'المستخدمون النشطون',
    'admin.users.stats.inactive': 'المستخدمون غير النشطين',
    'admin.users.stats.admins': 'المديرون',
    'admin.users.list.title': 'المستخدمون',
    'admin.users.list.subtitle': 'إدارة حسابات المستخدمين ومستويات وصولهم',
    'admin.users.list.searchPlaceholder': 'ابحث عن المستخدمين...',
    'admin.users.list.filterRole': 'تصفية حسب الدور',
    'admin.users.list.filterStatus': 'تصفية حسب الحالة',
    'admin.users.list.allRoles': 'كل الأدوار',
    'admin.users.list.allStatuses': 'كل الحالات',
    'admin.users.list.statusActive': 'نشط',
    'admin.users.list.statusInactive': 'غير نشط',
    'admin.users.list.lastLogin': 'آخر تسجيل دخول',
    'admin.users.list.never': 'أبدًا',
    'admin.users.editDialog.title': 'تعديل المستخدم',
    'admin.users.editDialog.description': 'تحديث معلومات المستخدم والأذونات.',
    'admin.users.editDialog.save': 'حفظ التغييرات',
  'admin.users.toast.created': 'تم إنشاء المستخدم {name} بنجاح!',
  'admin.users.toast.deleted': 'تم حذف المستخدم بنجاح!',
  'admin.users.toast.statusUpdated': 'تم تحديث حالة المستخدم!',
  'admin.users.toast.updated': 'تم تحديث المستخدم بنجاح!',

    // Admin Settings
    'admin.settings.title': 'إعدادات النظام',
    'admin.settings.subtitle': 'تكوين الإعدادات والتفضيلات على مستوى النظام',
    'admin.settings.saveButton': 'حفظ كل التغييرات',
    'admin.settings.saveSuccess': 'تم حفظ الإعدادات بنجاح!',

    'admin.settings.tabs.general': 'عام',
    'admin.settings.tabs.approval': 'الموافقات',
    'admin.settings.tabs.notifications': 'الإشعارات',
    'admin.settings.tabs.security': 'الأمان',
    'admin.settings.tabs.integrations': 'التكاملات',

    'admin.settings.general.title': 'الإعدادات العامة',
    'admin.settings.general.description': 'التكوين الأساسي للنظام ومعلومات الشركة',
    'admin.settings.general.companyName': 'اسم الشركة',
    'admin.settings.general.companyEmail': 'البريد الإلكتروني للشركة',
    'admin.settings.general.timezone': 'المنطقة الزمنية',
    'admin.settings.general.currency': 'العملة الافتراضية',

    'admin.settings.timezones.new_york': 'التوقيت الشرقي',
    'admin.settings.timezones.chicago': 'التوقيت المركزي',
    'admin.settings.timezones.denver': 'التوقيت الجبلي',
    'admin.settings.timezones.los_angeles': 'توقيت المحيط الهادئ',
    'admin.settings.timezones.london': 'لندن',
    'admin.settings.timezones.berlin': 'برلين',
    'admin.settings.timezones.tokyo': 'طوكيو',

    'admin.settings.currencies.usd': 'دولار أمريكي - دولار أمريكي',
    'admin.settings.currencies.eur': 'يورو - يورو',
    'admin.settings.currencies.gbp': 'جنيه إسترليني - جنيه إسترليني',
    'admin.settings.currencies.cad': 'دولار كندي - دولار كندي',
    'admin.settings.currencies.aud': 'دولار أسترالي - دولار أسترالي',

    'admin.settings.approval.title': 'إعدادات سير عمل الموافقة',
    'admin.settings.approval.description': 'تكوين عتبات الموافقة ومتطلبات سير العمل',
    'admin.settings.approval.autoApprovalThreshold': 'عتبة الموافقة التلقائية',
    'admin.settings.approval.autoApprovalThresholdHint': 'تتم الموافقة تلقائيًا على الطلبات التي تقل عن هذا المبلغ',
    'admin.settings.approval.requireManagerApproval': 'يتطلب موافقة المدير',
    'admin.settings.approval.requireManagerApprovalHint': 'يجب أن تتم الموافقة على جميع الطلبات من قبل المدير المباشر',
    'admin.settings.approval.requireAccountantApproval': 'يتطلب موافقة المحاسب',
    'admin.settings.approval.requireAccountantApprovalHint': 'الطلبات التي تتجاوز العتبة تتطلب موافقة المحاسب',
    'admin.settings.approval.requireFinalManagerApproval': 'يتطلب موافقة المدير النهائي',
    'admin.settings.approval.requireFinalManagerApprovalHint': 'الطلبات ذات القيمة العالية تتطلب موافقة المدير النهائي',
    'admin.settings.approval.approvalTimeout': 'مهلة الموافقة (أيام)',
    'admin.settings.approval.approvalTimeoutHint': 'تصعيد تلقائي في حالة عدم وجود رد خلال هذه الفترة',

    'admin.settings.notifications.title': 'إعدادات الإشعارات',
    'admin.settings.notifications.description': 'تكوين كيف ومتى يتلقى المستخدمون الإشعارات',
    'admin.settings.notifications.emailNotifications': 'إشعارات البريد الإلكتروني',
    'admin.settings.notifications.emailNotificationsHint': 'إرسال الإشعارات عبر البريد الإلكتروني',
    'admin.settings.notifications.slackIntegration': 'تكامل Slack',
    'admin.settings.notifications.slackIntegrationHint': 'إرسال الإشعارات إلى قنوات Slack',
    'admin.settings.notifications.reminderFrequency': 'تكرار التذكير',
    'admin.settings.notifications.triggersTitle': 'مشغلات الإشعارات',
    'admin.settings.notifications.onSubmission': 'تقديم طلب شراء',
    'admin.settings.notifications.onSubmissionHint': 'إشعار عند تقديم طلب شراء جديد',
    'admin.settings.notifications.onApproval': 'الموافقة على طلب الشراء',
    'admin.settings.notifications.onApprovalHint': 'إشعار عند الموافقة على طلب الشراء',
    'admin.settings.notifications.onRejection': 'رفض طلب الشراء',
    'admin.settings.notifications.onRejectionHint': 'إشعار عند رفض طلب الشراء',

    'admin.settings.frequencies.never': 'أبداً',
    'admin.settings.frequencies.daily': 'يوميًا',
    'admin.settings.frequencies.weekly': 'أسبوعيًا',
    'admin.settings.frequencies.monthly': 'شهريًا',
    'admin.settings.frequencies.hourly': 'كل ساعة',

    'admin.settings.security.title': 'إعدادات الأمان',
    'admin.settings.security.description': 'تكوين سياسات الأمان وقيود تحميل الملفات',
    'admin.settings.security.sessionTimeout': 'مهلة الجلسة (دقائق)',
    'admin.settings.security.passwordMinLength': 'الحد الأدنى لطول كلمة المرور',
    'admin.settings.security.requireMFA': 'يتطلب مصادقة متعددة العوامل',
    'admin.settings.security.requireMFAHint': 'يتطلب MFA لجميع حسابات المستخدمين',
    'admin.settings.security.allowedFileTypes': 'أنواع الملفات المسموح بها',
    'admin.settings.security.allowedFileTypesHint': 'قائمة مفصولة بفواصل بامتدادات الملفات المسموح بها',
    'admin.settings.security.maxFileSize': 'الحد الأقصى لحجم الملف (ميجابايت)',

    'admin.settings.integrations.title': 'تكاملات النظام',
    'admin.settings.integrations.description': 'تكوين تكاملات الأنظمة الخارجية والنسخ الاحتياطي للبيانات',
    'admin.settings.integrations.erpIntegration': 'تكامل ERP',
    'admin.settings.integrations.erpIntegrationHint': 'الاتصال بنظام ERP خارجي',
    'admin.settings.integrations.erpApiEndpoint': 'نقطة نهاية واجهة برمجة تطبيقات ERP',
    'admin.settings.integrations.erpApiKey': 'مفتاح واجهة برمجة تطبيقات ERP',
    'admin.settings.integrations.erpApiKeyPlaceholder': 'أدخل مفتاح API',
    'admin.settings.integrations.backupFrequency': 'تكرار النسخ الاحتياطي',
    'admin.settings.integrations.maintenanceTitle': 'صيانة النظام',
    'admin.settings.integrations.backupDb': 'قاعدة بيانات النسخ الاحتياطي',
    'admin.settings.integrations.exportLog': 'تصدير سجل التدقيق',
    'admin.settings.integrations.syncDir': 'مزامنة دليل المستخدم',
    'admin.settings.integrations.healthCheck': 'فحص سلامة النظام',

    // Login Page
    'login.title': 'تسجيل الدخول إلى حسابك',
    'login.subtitle': 'نظام إدارة طلبات الشراء',
    'login.welcome': 'مرحباً بعودتك',
    'login.welcomeSubtitle': 'أدخل بيانات الاعتماد الخاصة بك للوصول إلى حسابك',
    'login.emailLabel': 'عنوان البريد الإلكتروني',
    'login.emailPlaceholder': 'أدخل بريدك الإلكتروني',
    'login.passwordLabel': 'كلمة المرور',
    'login.passwordPlaceholder': 'ادخل كلمة المرور',
    'login.rememberMe': 'تذكرني',
    'login.forgotPassword': 'هل نسيت كلمة المرور؟',
    'login.signInButton': 'تسجيل الدخول',
    'login.signingInButton': 'جارٍ تسجيل الدخول...',
    'login.demoCredentials': 'بيانات اعتماد تجريبية',
    'login.demo.admin': 'مسؤول:',
    'login.demo.manager': 'مدير:',
    'login.demo.accountant': 'محاسب:',
    'login.demo.user': 'مستخدم:',
    'login.demo.password': 'أي كلمة مرور',
    'login.errors.invalidEmail': 'الرجاء إدخال عنوان بريد إلكتروني صالح',
    'login.errors.passwordRequired': 'كلمة المرور مطلوبة',

    // Not Found Page
    'notfound.title': '٤٠٤',
    'notfound.message': 'عفوا! الصفحة غير موجودة',
    'notfound.link': 'العودة إلى الصفحة الرئيسية',

    // Statuses
    'status.DRAFT': 'مسودة',
    'status.PENDING': 'معلق',
    'status.REJECTED': 'مرفوض',
    'status.APPROVED': 'موافق عليه',
    'status.SUBMITTED': 'مقدم',
    'status.DM_APPROVED': 'موافقة المدير المباشر',
    'status.ACCT_APPROVED': 'موافقة المحاسب',
    'status.FINAL_APPROVED': 'موافقة نهائية',
    'status.FUNDS_TRANSFERRED': 'تم تحويل الأموال',

    // Roles
    'roles.USER': 'مستخدم',
    'roles.MANAGER': 'مدير',
    'roles.ACCOUNTANT': 'محاسب',
    'roles.ADMIN': 'مسؤول',
    'roles.DIRECT_MANAGER': 'مدير مباشر',
    'roles.FINAL_MANAGER': 'مدير نهائي',

    // Unauthorized Page
    'unauthorized.title': 'تم رفض الوصول',
    'unauthorized.message': 'ليس لديك صلاحية للوصول إلى هذه الصفحة. يرجى التواصل مع المسؤول إذا كنت تعتقد أن هذا خطأ.',
    'unauthorized.back': 'العودة إلى لوحة التحكم',

    // PR Store Toasts
    'pr.toast.createSuccess': 'تم إنشاء طلب الشراء بنجاح!',
    'pr.toast.createError': 'فشل إنشاء طلب الشراء',
    'pr.toast.updateSuccess': 'تم تحديث طلب الشراء بنجاح!',
    'pr.toast.updateError': 'فشل تحديث طلب الشراء',
    'pr.toast.deleteSuccess': 'تم حذف طلب الشراء بنجاح!',
    'pr.toast.deleteError': 'فشل حذف طلب الشراء',
    'pr.toast.fetchError': 'فشل جلب طلبات الشراء',
    'pr.toast.approveSuccess': 'تمت الموافقة على طلب الشراء بنجاح!',
    'pr.toast.approveError': 'فشل في الموافقة على طلب الشراء',
    'pr.toast.rejectSuccess': 'تم رفض طلب الشراء',
    'pr.toast.rejectError': 'فشل رفض طلب الشراء',

    // Auth Toasts
    'auth.toast.welcomeBack': 'مرحباً بعودتك، {name}!',
    'auth.toast.logoutSuccess': 'تم تسجيل الخروج بنجاح',
    
    // Notifications
    'notifications.markAllRead': 'تحديد الكل كمقروء',
    'notifications.viewAll': 'عرض جميع الإشعارات',
    'notifications.empty': 'لا توجد إشعارات',
    'notifications.time.minutes': 'منذ {value} دقائق',
    'notifications.time.hours': 'منذ {value} ساعة/ساعات',
    'notifications.time.days': 'منذ {value} يوم/أيام',
    'notifications.approval.title': 'طلب شراء يحتاج إلى موافقة',
    'notifications.approval.message': 'طلب شراء-2024-001: المستلزمات المكتبية تتطلب موافقتك',
    'notifications.approved.title': 'تمت الموافقة على طلب الشراء',
    'notifications.approved.message': 'تمت الموافقة على طلب المواد التسويقية الخاص بك',
    'notifications.rejected.title': 'تم رفض طلب الشراء',
    'notifications.rejected.message': 'تم رفض طلب شراء-2024-003: شراء المعدات',
    'notifications.assignment.title': 'مهمة جديدة',
    'notifications.assignment.message': 'تم تعيينك كموافق لمعدات تكنولوجيا المعلومات',
    'notifications.reminder.title': 'تذكير بالموافقات المعلقة',
    'notifications.reminder.message': 'لديك موافقتين معلقتين تحتاجان إلى اهتمامك',

    // Approvals Page
    'approvals.stats.urgentWithin3Days': 'خلال ٣ أيام',
    'approvals.labels.sla': 'اتفاقية مستوى الخدمة',
    'approvals.labels.id': 'معرّف',
    'approvals.labels.due': 'مطلوب بحلول',
    'approvals.empty.title': 'لا توجد موافقات معلّقة',
    'approvals.empty.filtered': 'لا توجد طلبات تطابق عوامل التصفية الحالية.',
    'approvals.empty.allCaughtUp': 'كل شيء منتهٍ! لا توجد طلبات شراء تتطلب موافقتك حالياً.',
  },
};