var loginvue = new Vue({
  el: "#login-vue",
  data: {
    current_choice: 1,
    username: '',
    password: '',
    confirm_pass: '',
    email: ''
  },
  methods: {
    change_choice: function(n) {
      switch (n) {
        case 1:
          document.getElementsByClassName("choice")[0].className += " active";
          document.getElementsByClassName("choice")[1].classList.remove("active")
          document.getElementById("signup-form").style.display = "none";
          document.getElementById("signin-form").style.display = "block";
          break;
        case 2:
          document.getElementsByClassName("choice")[1].className += " active";
          document.getElementsByClassName("choice")[0].classList.remove("active")
          document.getElementById("signin-form").style.display = "none";
          document.getElementById("signup-form").style.display = "block";
          break;
      }
    },
    login_account: function() {
      if (this.username != '' && this.password != '') {
        axios.get('http://jtcarlos.pythonanywhere.com/login_user', {
          auth: {
            username: this.username,
            password: this.password
          }
        })
        .then(response => {
          if (response.data['status'] == "200") {
            localStorage.setItem('token', response.data['token']);
            document.location.href="/";
          }
          else {
            document.getElementsByClassName('credential-error')[0].style.display = "Block";
            document.getElementsByClassName('incomplete-error')[0].style.display = "None";
          }
        })
      }
      else {
        document.getElementsByClassName('incomplete-error')[0].style.display = "Block";
        document.getElementsByClassName('credential-error')[0].style.display = "None";
      }
    },
    open_overlay: function() {
      document.getElementsByClassName("overlay")[0].style.display = "block";
    },
    close_overlay: function() {
      document.getElementsByClassName("overlay")[0].style.display = "none";
    },
    register_account: function() {
      if (this.username != '' && this.password != '' && this.confirm_pass != '' && this.email != '') {
        if (this.password == this.confirm_pass) {
          axios.post('http://jtcarlos.pythonanywhere.com/register_user', {
            sent_user: this.username,
            sent_pass: this.password,
            sent_email: this.email
          })
          .then(response => {
            if (response.data == "200") {
              document.getElementsByClassName('alert-message')[0].style.display = "block";
              document.getElementsByClassName('account-created')[0].style.display = "block";

              this.username = '';
              this.password = '';
              this.confirm_pass = '';
              this.email = '';

              document.getElementsByClassName('password-mismatch')[0].style.display = "none";
              document.getElementsByClassName('field-error')[0].style.display = "none";
              document.getElementsByClassName('invalid-email')[0].style.display = "none";
              document.getElementsByClassName('email-taken')[0].style.display = "none";
            }
            else if (response.data == "409") {
              document.getElementsByClassName('alert-message')[0].style.display = "block";
              document.getElementsByClassName('email-taken')[0].style.display = "block";

              document.getElementsByClassName('password-mismatch')[0].style.display = "none";
              document.getElementsByClassName('field-error')[0].style.display = "none";
              document.getElementsByClassName('account-created')[0].style.display = "none";
              document.getElementsByClassName('invalid-email')[0].style.display = "none";
            }
            else if (response.data == "400") {
              document.getElementsByClassName('alert-message')[0].style.display = "block";
              document.getElementsByClassName('invalid-email')[0].style.display = "block";

              document.getElementsByClassName('password-mismatch')[0].style.display = "none";
              document.getElementsByClassName('field-error')[0].style.display = "none";
              document.getElementsByClassName('email-taken')[0].style.display = "none";
              document.getElementsByClassName('account-created')[0].style.display = "none";
            }
          })
        }
        else {
          document.getElementsByClassName('alert-message')[0].style.display = "block";
          document.getElementsByClassName('password-mismatch')[0].style.display = "block";

          document.getElementsByClassName('field-error')[0].style.display = "none";
          document.getElementsByClassName('email-taken')[0].style.display = "none";
          document.getElementsByClassName('account-created')[0].style.display = "none";
          document.getElementsByClassName('invalid-email')[0].style.display = "none";
        }
      }
      else {
        document.getElementsByClassName('alert-message')[0].style.display = "block";
        document.getElementsByClassName('field-error')[0].style.display = "block";

        document.getElementsByClassName('password-mismatch')[0].style.display = "none";
        document.getElementsByClassName('invalid-email')[0].style.display = "none";
        document.getElementsByClassName('email-taken')[0].style.display = "none";
        document.getElementsByClassName('account-created')[0].style.display = "none";
      }
    }
  }
})

var homevue = new Vue({
  el: "#home-vue",
  data: {
    // User information
    user_id: 0,
    currency_sign: '$',
    email: '',

    // User update variables
    update_username: '',
    update_currency: '',
    update_new_pass: '',
    update_con_pass: '',
    update_cur_pass: '',
    update_new_email: '',
    update_message: '',

    // Edit Expense variables
    edit_expenese_message: '',

    menuchoice: 1,
    dropdownIsOpen: false,
    username: 'Login | Sign Up',
    recent_expenses: [],
    all_expenses: [],
    ave_year: 0,
    ave_month: 0,
    statistic_choice: 3,
    day: "Day",
    month: "Month",
    year: "Year",
    short_desc: '',
    cost: '',
    userDataChanged: false,
    reportIsEmpty: true,
    recentReportIndicators: [],

    // Search variables
    keyword: '',
    searchedExp: [],
    total_searched: 0,

    // Delete expense variables
    detail_date: '',
    detail_desc: '',
    detail_cost: '',
    temp_detail_date: '',
    temp_detail_desc: '',
    temp_detail_cost: '',
    detail_id: 0,

    // Daily expense variables
    daily_labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],

    // Monthly expense variables
    monthly_labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    monthly_expenses: [],

    // Yearly expenses variables
    year_labels: [],
    year_expenses: {},
  },
  methods: {
    showDashboard: function () {
      document.getElementsByClassName('dashboard')[0].style.display = "Block";
      document.getElementsByClassName('account-settings')[0].style.display = "None";
    },
    showAccountSettings: function() {
      document.getElementsByClassName('dashboard')[0].style.display = "None";
      document.getElementsByClassName('account-settings')[0].style.display = "Block";
      this.update_username = this.username;
      this.closeDropdowns();
    },
    closeDropdowns: function() {
      document.getElementsByClassName('search-dropdown')[0].style.display = "None";
      document.getElementsByClassName('username-dropdown')[0].style.display = "None";
      this.dropdownIsOpen = false;
    },
    keepDropdown: function(n) {
      if (n == 1) {
        document.getElementsByClassName('search-dropdown')[0].style.display = "Block";
      }
      if (n == 2) {
        document.getElementsByClassName('username-dropdown')[0].style.display = "Block";
      }
    },
    searchExpense: function() {
      document.getElementsByClassName('search-dropdown')[0].style.display = "Block";
      if (this.keyword != '') {
        var query_string = "key=" + this.keyword + "&id=" + this.user_id
        axios.get("http://jtcarlos.pythonanywhere.com/search_expense?" + query_string)
        .then(response => {
          if (response.data['status'] == '200') {
            this.searchedExp = response.data['expenses'];
            document.getElementsByClassName('search-nothing')[0].style.display = "None";
            this.total_searched = response.data['num_of_exp'];
          }
          else if (response.data['status'] == '404') {
            this.searchedExp = {};
            document.getElementsByClassName('search-nothing')[0].style.display = "Block";
            this.total_searched = 0;
          }
        })
      }
      else {
        this.searchedExp = {};
        this.total_searched = 0;
        document.getElementsByClassName('search-nothing')[0].style.display = "Block";
      }
    },
    loadRecentIndicators: function() {
      for (var counter = 0; counter < this.recentReportIndicators.length; counter++) {
        document.getElementsByClassName('expense-rating')[counter].style.backgroundColor = this.recentReportIndicators[counter];
      }
    },
    close_overlay: function() {
      document.getElementsByClassName('overlay')[0].style.display = "None";
      document.getElementsByClassName('welcome-message')[0].style.display = "None";
    },
    showDetails: function(date, desc, cost, id, n) {
      if (localStorage.getItem('numUser') == 1) {
        // Set details
        this.detail_date = date;
        this.detail_desc = desc;
        this.detail_cost = cost;
        this.temp_detail_date = date;
        this.temp_detail_desc = desc;
        this.temp_detail_cost = cost;
        this.detail_id = id;

        if (n == 1) {
          document.getElementsByClassName('overlay')[0].style.display = "Block";
          document.getElementsByClassName('delete-join-message')[0].style.display = "None";
          document.getElementsByClassName('delete-message')[0].style.display = "Block";
          document.getElementsByClassName('delete-warning')[0].style.display = "Block";
          document.getElementsByClassName('delete-successful')[0].style.display = "None";
          document.getElementsByClassName('edit-expense')[0].style.display = "None";
          document.getElementsByClassName('welcome-message')[0].style.display = "None";
          // Show delete and cancel buttons
          document.getElementsByClassName('delete-btn')[3].style.display = "inline-block";
          document.getElementsByClassName('delete-btn')[4].style.display = "inline-block";
          // Hide close buttons
          document.getElementsByClassName('close-delete-form-btn')[0].style.display = "None";
        }
        else if (n == 2) {
          // Show Buttons
          document.getElementsByClassName('delete-btn')[0].style.display = "inline-block";
          document.getElementsByClassName('delete-btn')[1].style.display = "inline-block";
          // Show Overlay
          document.getElementsByClassName('overlay')[0].style.display = "Block";
          document.getElementsByClassName('delete-message')[0].style.display = "None";
          document.getElementsByClassName('delete-join-message')[0].style.display = "None";
          document.getElementsByClassName('edit-expense')[0].style.display = "Block";
          document.getElementsByClassName('update-message')[0].style.display = "Block";
          document.getElementsByClassName('update-successful')[0].style.display = "None";
          document.getElementsByClassName('delete-btn')[2].style.display = "none";
          document.getElementsByClassName('welcome-message')[0].style.display = "None";
        }
      }
      else if (localStorage.getItem('numUser') == 0) {
        document.getElementsByClassName('overlay')[0].style.display = "Block";
        document.getElementsByClassName('delete-message')[0].style.display = "None";
        document.getElementsByClassName('delete-join-message')[0].style.display = "Block";
        document.getElementsByClassName('edit-expense')[0].style.display = "None";
      }
    },
    updateexpense: function() {
      axios.post('http://jtcarlos.pythonanywhere.com/update_expense', {
        update_date: this.temp_detail_date,
        update_desc: this.temp_detail_desc,
        update_cost: this.temp_detail_cost,
        update_id: this.detail_id
      })
      .then(response => {
        document.getElementsByClassName('update-message')[0].style.display = "None";
        if (response.data['message'] == "date"){
          this.edit_expenese_message = "Date is invalid. Please re-enter with the correct format: MONTH-DAY-YEAR."
          document.getElementsByClassName('update-successful')[0].style.display = "None";
          document.getElementsByClassName('update-failure')[0].style.display = "Block";
        }
        else if (response.data['message'] == "cost"){
          this.edit_expenese_message = "Expense is invalid. Expense can only consist of numeric characters."
          document.getElementsByClassName('update-successful')[0].style.display = "None";
          document.getElementsByClassName('update-failure')[0].style.display = "Block";
        }
        else if (response.data['message'] == "updated"){
          // Hide previous delete buttons
          document.getElementsByClassName('delete-btn')[0].style.display = "None";
          document.getElementsByClassName('delete-btn')[1].style.display = "None";
          document.getElementsByClassName('delete-btn')[2].style.display = "inline-block";
          document.getElementsByClassName('update-successful')[0].style.display = "Block";
          document.getElementsByClassName('update-failure')[0].style.display = "None";
          // Refresh data
          this.getuserstatistics();
        }
      })
    },
    updateuser: function(n) {
      if (this.update_con_pass != this.update_new_pass) {
        alert('ERROR');
      }
      else {
        axios.post('http://jtcarlos.pythonanywhere.com/update_user', {
          choice: n,
          sent_id: this.user_id,
          sent_username: this.update_username,
          sent_currency: this.update_currency,
          sent_new_pass: this.update_new_pass,
          sent_current_pass: this.update_cur_pass,
          sent_email: this.update_new_email
        })
        .then(response => {
          // Refresh data
          if (response.data == "200") {
            this.getuserstatistics();
            document.getElementsByClassName('update-user-successful')[0].style.display = "Block";
            switch(n) {
              case 1:
                this.update_message = "username";
                break;
              case 2:
                this.update_message = "currency";
                break;
              case 3:
                this.update_message = "password";
                break;
              case 4:
                this.update_message = "email";
                break;
            }
          }
        })
      }
    },
    deleteexpense: function() {
      axios.post('http://jtcarlos.pythonanywhere.com/delete_expense', {sent_id: this.detail_id})
      .then(response => {
        document.getElementsByClassName('delete-warning')[0].style.display = "None";
        document.getElementsByClassName('delete-successful')[0].style.display = "Block";
        // Hide previous delete buttons
        document.getElementsByClassName('delete-btn')[3].style.display = "None";
        document.getElementsByClassName('delete-btn')[4].style.display = "None";
        // Show close buttons
        document.getElementsByClassName('close-delete-form-btn')[0].style.display = "inline-block";
        // Refresh data
        this.getuserstatistics();
      })
    },
    getuserstatistics: function() {
      let config = {
        headers: {
          "access-control":localStorage.getItem('token')
        }
      }

      // Get user information
      axios.post('http://jtcarlos.pythonanywhere.com/check_token', {}, config)
      .then(response => {
        // Update user info
        this.username = response.data['username'];
        this.user_id = response.data['id'];
        this.currency_sign = response.data['currency'];
        this.email = response.data['email'];

        this.recent_expenses = response.data['recent_expenses'];
        this.all_expenses = response.data['all_expenses'];
        this.recentReportIndicators = response.data['recent_report_indicators'];

        // Get monthly stats
        this.monthly_expenses = response.data['user_statistics']['monthly_stats'];
        this.ave_month = response.data['user_statistics']['yearly_stats']['average_m'];

        // Get yearly stats
        this.year_labels = response.data['user_statistics']['yearly_stats']['label'];
        this.year_expenses = response.data['user_statistics']['yearly_stats']['dataset'];
        this.ave_year = response.data['user_statistics']['yearly_stats']['average_y'];

        // Check if report is empty
        this.reportIsEmpty = response.data['report_is_empty'];

        // Create Monthly Expenses Chart
        var monthlyStatistics = document.getElementById('monthlyStatistics').getContext('2d');
        var monthlyxpenseChart = new Chart(monthlyStatistics, {type: 'bar', data: { labels: this.monthly_labels, datasets: this.monthly_expenses}})
        // Create Yearly Expenses Chart
        var yearlyStatistics = document.getElementById('yearlyStatistics').getContext('2d');
        var yearlyxpenseChart = new Chart(yearlyStatistics, {type: 'bar', data: { labels: this.year_labels, datasets: [this.year_expenses]}})
      })
    },
    createexpense: function() {
      if (this.day != "Day" && this.month != "Month" && this.year != "Year" && this.short_desc != '' && this.cost != '') {
        if (this.cost.match(/[a-zA-Z]/)) {
          document.getElementsByClassName('error-expense-field')[0].style.display = "Block";
          document.getElementsByClassName('error-incomplete')[0].style.display = "None";
          document.getElementsByClassName('expense-created')[0].style.display = "None";
        }
        else {
          axios.post('http://jtcarlos.pythonanywhere.com/new_expense', {
            sent_user: this.user_id,
            sent_date: this.month + "-" + this.day + "-" + this.year,
            sent_desc: this.short_desc,
            sent_cost: this.cost
          })

          this.getuserstatistics();
          this.loadRecentIndicators();

          document.getElementsByClassName('expense-created')[0].style.display = "Block";
          document.getElementsByClassName('error-incomplete')[0].style.display = "None";
          document.getElementsByClassName('error-expense-field')[0].style.display = "None";

          // Reset back all fields
          this.day = "Day";
          this.month = "Month";
          this.year = "Year";
          this.short_desc = '';
          this.cost = '';
          this.userDataChanged = true;
        }
      }
      else {
        document.getElementsByClassName('error-incomplete')[0].style.display = "Block";
        document.getElementsByClassName('error-expense-field')[0].style.display = "None";
        document.getElementsByClassName('expense-created')[0].style.display = "None";
      }
    },
    logoutUser: function() {
      this.username = "Login | Sign Up";
      localStorage.setItem('token', '');
      localStorage.setItem('numUser', '0')
      document.location.href = "loginsignup";
    },
    showUsernameDropdown: function() {
      if (localStorage.getItem('numUser') == '1') {
        if (this.dropdownIsOpen) {
          document.getElementsByClassName('username-dropdown')[0].style.display = "None";
          this.dropdownIsOpen = false;
        }
        else if (!this.dropdownIsOpen) {
          document.getElementsByClassName('username-dropdown')[0].style.display = "Block";
          this.dropdownIsOpen = true;
        }
      }
      else {
        document.location.href = "loginsignup";
      }
    },
    choiceswitch: function(n) {
      if (this.userDataChanged) {
        // update front end
        this.getuserstatistics();
        this.userDataChanged = false;
      }
      switch (n) {
        case 1:
          if (this.menuchoice != 0) {
            document.getElementsByClassName('recent-section')[0].style.display = "none";
            document.getElementsByClassName('statistics-section')[0].style.display = "none";
            document.getElementsByClassName('all-expenses-section')[0].style.display = "none";
            document.getElementsByClassName('create-new-form')[0].style.display = "block";
            document.getElementsByClassName('nav-btn')[0].className += " active";
            document.getElementsByClassName('nav-btn')[this.menuchoice].classList.remove('active');
            this.menuchoice = 0;

            // Clear all previous messages if any
            document.getElementsByClassName('error-incomplete')[0].style.display = "None";
            document.getElementsByClassName('error-expense-field')[0].style.display = "None";
            document.getElementsByClassName('expense-created')[0].style.display = "None";

            // Clear all fields
            this.day = "Day";
            this.month = "Month";
            this.year = "Year";
            this.short_desc = '';
            this.cost = '';
          }
          break;
        case 2:
          if (this.menuchoice != 1) {
            document.getElementsByClassName('create-new-form')[0].style.display = "none";
            document.getElementsByClassName('all-expenses-section')[0].style.display = "none";
            document.getElementsByClassName('recent-section')[0].style.display = "block";
            document.getElementsByClassName('statistics-section')[0].style.display = "block";
            document.getElementsByClassName('nav-btn')[1].className += " active";
            document.getElementsByClassName('nav-btn')[this.menuchoice].classList.remove('active');
            this.menuchoice = 1;

          }
          break;
        case 3:
          if (this.menuchoice != 2) {
            document.getElementsByClassName('recent-section')[0].style.display = "none";
            document.getElementsByClassName('statistics-section')[0].style.display = "none";
            document.getElementsByClassName('create-new-form')[0].style.display = "none";
            document.getElementsByClassName('all-expenses-section')[0].style.display = "Block";
            document.getElementsByClassName('nav-btn')[2].className += " active";
            document.getElementsByClassName('nav-btn')[this.menuchoice].classList.remove('active');
            this.menuchoice = 2;
          }
          break;
      }
    },
    chooseStat: function(n) {
      switch(n) {
        case 1:
          document.getElementById('daily-stat').style.display = "none";
          document.getElementById('monthly-stat').style.display = "Block";
          document.getElementById('yearly-stat').style.display = "none";
          document.getElementsByClassName('nav-btn')[this.statistic_choice].classList.remove('active');
          document.getElementsByClassName('nav-btn')[3].className += " active";
          this.statistic_choice = 3;
          break;
        case 2:
          document.getElementById('daily-stat').style.display = "none";
          document.getElementById('monthly-stat').style.display = "none";
          document.getElementById('yearly-stat').style.display = "Block";
          document.getElementsByClassName('nav-btn')[this.statistic_choice].classList.remove('active');
          document.getElementsByClassName('nav-btn')[4].className += " active";
          this.statistic_choice = 4;
          break;
      }
    }
  },
  created: function() {
    let config = {
      headers: {
        "access-control":localStorage.getItem('token')
      }
    }

    // Get user information
    axios.post('http://jtcarlos.pythonanywhere.com/check_token', {}, config)
    .then(response => {
      // If there is someone logged in
      if (response.data['status'] == "200") {
        // Update user info
        this.username = response.data['username'];
        localStorage.setItem('numUser', '1');
        document.getElementsByClassName('join-message')[1].style.display = "None";
        document.getElementsByClassName('form-e1')[0].style.display = 'Block';
      }
      // Else if none, query default
      else {
        localStorage.setItem('numUser', '0');
        document.getElementsByClassName('form-e1')[0].style.display = 'None';
        document.getElementsByClassName('arrow-down')[0].style.display = "None";

        // Welcome Message
        document.getElementsByClassName('overlay')[0].style.display = "Block";
        document.getElementsByClassName('welcome-message')[0].style.display = "Block";
        document.getElementsByClassName('delete-message')[0].style.display = "None";
        document.getElementsByClassName('edit-expense')[0].style.display = "None";
      }

      this.user_id = response.data['id'];
      this.currency_sign = response.data['currency'];
      this.email = response.data['email'];

      this.recent_expenses = response.data['recent_expenses'];
      this.all_expenses = response.data['all_expenses'];
      this.recentReportIndicators = response.data['recent_report_indicators'];

      // Check if report is empty
      this.reportIsEmpty = response.data['report_is_empty'];

      // Get monthly stats
      this.monthly_expenses = response.data['user_statistics']['monthly_stats'];
      this.ave_month = response.data['user_statistics']['yearly_stats']['average_m'];

      // Get yearly stats
      this.year_labels = response.data['user_statistics']['yearly_stats']['label'];
      this.year_expenses = response.data['user_statistics']['yearly_stats']['dataset'];
      this.ave_year = response.data['user_statistics']['yearly_stats']['average_y'];

      // Create Monthly Expenses Chart
      var monthlyStatistics = document.getElementById('monthlyStatistics').getContext('2d');
      var monthlyxpenseChart = new Chart(monthlyStatistics, {type: 'bar', data: { labels: this.monthly_labels, datasets: this.monthly_expenses}});
      // Create Yearly Expenses Chart
      var yearlyStatistics = document.getElementById('yearlyStatistics').getContext('2d');
      var yearlyxpenseChart = new Chart(yearlyStatistics, {type: 'bar', data: { labels: this.year_labels, datasets: [this.year_expenses]}});
    })
  },
  updated: function() {
    this.loadRecentIndicators();
  }
})
