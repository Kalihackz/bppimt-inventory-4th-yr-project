//-----------------------MODULES-------------------------------
const fs = require('fs');
const http = require('http');
const os = require('os');
const url = require('url');
var ejs = require('ejs');
const chalk = require('chalk');
var crypto = require('crypto');
//--------------------------------------------------------------

//-----------------------IP AND PORT INFO----------------------------
const hostname = '0.0.0.0';
const port = 80;
//-------------------------------------------------------------------
//--------------------------MONGO DB----------------------------------
var mongoose = require('mongoose');
mongoose.connect(
	'mongodb+srv://admin:fakeaccount@cluster0.ni1kx.mongodb.net/users?retryWrites=true&w=majority',
	{
		useUnifiedTopology: true,
		useNewUrlParser: true
	}
);
var conn = mongoose.connection;
conn.once('open', function() {});
conn.on('connected', function() {
	console.log(
		chalk.bold.rgb(255, 255, 51)('📡 Opening and connecting to MongoDB...')
	);
	console.log(
		chalk.bold.rgb(10, 250, 0)('🖥️  ------- MongoDB is connected -------')
	);
	console.log(
		chalk.bold.rgb(10, 250, 0)('---------------------------------------')
	);
});
conn.on('disconnected', function() {
	console.log(
		chalk.bold.rgb(255, 0, 0)('🖥️  ----- MongoDB is disconnected -----')
	);
});
conn.on('error', console.error.bind(console, 'connection error:'));
//---------------------------------------------------------------------
//----------------------MONGO DB SCHEMA------------------------
var userSchema = new mongoose.Schema({
	fname: { type: String },
	lname: { type: String },
	email_id: { type: String },
	employee_id: { type: String },
	password: { type: String },
	designation: { type: String },
	status: { type: String },
	cookie: { type: String },
	lab_no: { type: String }
});
userSchema.index({ '$**': 'text' });
User = mongoose.model('Users', userSchema);
var userSchema2 = new mongoose.Schema({
	product_id: { type: String },
	product_category: { type: String },
	product_type: { type: String },
	brand: { type: String },
	price: { type: String },
	supplier: { type: String },
	purchase_date: { type: String },
	transaction_id: { type: String },
	employee_id: { type: String },
	fname: { type: String },
	lname: { type: String },
	installation_place: { type: String },
	issue_date: { type: String },
	status: { type: String }
});
userSchema2.index({ '$**': 'text' });
Item = mongoose.model('Items', userSchema2);
var userSchema4 = new mongoose.Schema({
	product_category: { type: String },
	product_type: { type: String },
	quantity_purchased: { type: String },
	inventory_stat: { type: String },
	in_use_stat: { type: String },
	discarded_stat: { type: String },
	repair_stat: { type: String }
});
userSchema4.index({ '$**': 'text' });
Summary = mongoose.model('Summaries', userSchema4);
var userSchema3 = new mongoose.Schema({
	employee_id: { type: String },
	fname: { type: String },
	lname: { type: String },
	email_id: { type: String },
	product_category: { type: String },
	product_type: { type: String },
	quantity_required: { type: String },
	installation_place: { type: String },
	status: { type: String }
});
userSchema3.index({ '$**': 'text' });
Request = mongoose.model('Requests', userSchema3);
//-------------------------------------------------------------
//-------------------------------------------------------------------------
const server = http.createServer((req, res) => {
	var hostInfo = req.headers['host'];

	//---------------- IP of Foreign Host------------------
	var ip =
		req.headers['x-forwarded-for'] ||
		'' ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		req.connection.socket.remoteAddress;
	//var ip = req.headers['x-forwarded-for']
	//-----------------------------------------------------
	//----------Log Info of Foreign Host with timestamp----------
	console.log(
		chalk.bold.rgb(255, 102, 178)(time()) +
			' | IP : ' +
			chalk.bold.rgb(255, 255, 0)(ip) +
			' => ' +
			chalk.bold.rgb(153, 50, 204)(hostInfo) +
			' , ' +
			chalk.bold.rgb(255, 0, 0)(req.method) +
			':' +
			chalk.bold.rgb(153, 255, 255)(req.url)
	);
	//-----------------------------------------------------------

	//-----------------------URL INFO----------------------------
	var add = `http://${hostInfo}${req.url}`;
	var q = url.parse(add, true);
	var path = q.pathname;
	//-------------------------------------------------------------

	// if (hostInfo == 'www.bppimtinventory.com' || hostInfo == 'bppimtinventory.com' || hostInfo == 'bppimtinventory.abirghosh2.repl.co') {
	// checkProtocol(req, res, hostInfo, path)
	// all SEO related stuffs
	const robots = fs.readFileSync('./robots.txt', 'utf8');
	const sitemap = fs.readFileSync('./sitemap.xml', 'utf8');

	var template_path = './template';
	// all webpages related stuffs
	const landpage = fs.readFileSync(template_path + '/landPage.html', 'utf8');
	const admin = fs.readFileSync(template_path + '/admin.ejs', 'utf8');
	const teacher = fs.readFileSync(template_path + '/teacher.ejs', 'utf8');
	const register = fs.readFileSync(template_path + '/register.ejs', 'utf8');
	const auth = fs.readFileSync(template_path + '/authEmployee.html', 'utf8');
	const blank1 = fs.readFileSync(template_path + '/blankPage1.ejs', 'utf8');
	const blank2 = fs.readFileSync(template_path + '/blankPage2.ejs', 'utf8');
	const resetpass = fs.readFileSync(template_path + '/resetpass.html', 'utf8');
	const code = fs.readFileSync(template_path + '/code.html', 'utf8');
	const itemsSummary = fs.readFileSync(
		template_path + '/itemsSummary.html',
		'utf8'
	);
	const team = fs.readFileSync(template_path + '/team.html', 'utf8');
	const rejecteditem = fs.readFileSync(
		template_path + '/rejecteditem.html',
		'utf8'
	);

	if (req.method == 'GET') {
		if (path == '/sitemap.xml') {
			route(res, 200, 'OK', 'text/xml', sitemap, {});
		} else if (path == '/robots.txt') {
			route(res, 200, 'OK', 'text/plain', robots, {});
		} else if (path == '/team') {
			route(res, 200, 'OK', 'text/html', team, {});
		} else if (path == '/login' || path == '/') {
			try {
				var cookieVal = readCookie(req, 'id');
				User.exists({ cookie: cookieVal }, function(err, docs) {
					if (err) {
						route(res, 200, 'OK', 'text/html', `Please try again later`, {});
					} else {
						if (docs) {
							if (cookieVal.startsWith('EMPAD')) {
								res.writeHead(302, { Location: '/admin' });
								res.end();
							} else if (cookieVal.startsWith('EMPTE')) {
								res.writeHead(302, { Location: '/teacher' });
								res.end();
							} else {
								route(res, 200, 'OK', 'text/html', landpage, {});
							}
						} else {
							route(res, 200, 'OK', 'text/html', landpage, {});
						}
					}
				});
			} catch (e) {
				route(res, 200, 'OK', 'text/html', landpage, {});
			}
		} else if (path == '/forget') {
			route(res, 200, 'OK', 'text/html', resetpass, {});
		} else if (path == '/register') {
			var emp_id = q.query.emp;
			console.log(emp_id);
			User.exists({ employee_id: emp_id }, function(err, docs) {
				if (err) {
					route(res, 200, 'OK', 'text/html', `Please try again later`, {});
				} else {
					if (docs) {
						User.findOne({ employee_id: emp_id }, function(err, docs) {
							if (err) {
								console.log(err);
							} else {
								docs = JSON.parse(JSON.stringify(docs));
								if (docs.status == 'Non-Active') {
									route(res, 200, 'OK', 'text/html', register, {
										emp_id: docs.employee_id,
										designation: docs.designation
									});
								} else {
									res.writeHead(302, { Location: '/auth' });
									res.end();
								}
							}
						});
					} else {
						res.writeHead(302, { Location: '/auth' });
						res.end();
					}
				}
			});
		} else if (path == '/logout') {
			res.setHeader('Set-Cookie', 'id=logout; Max-Age=0; HttpOnly, Secure');
			res.writeHead(302, { Location: '/login' });
			res.end();
		} else if (path == '/admin') {
			try {
				var cookieVal = readCookie(req, 'id');
				User.exists({ cookie: cookieVal }, function(err, docs) {
					if (err) {
						route(res, 200, 'OK', 'text/html', `Please try again later`, {});
					} else {
						if (docs) {
							if (cookieVal.startsWith('EMPAD')) {
								User.findOne({ cookie: cookieVal }, function(err, docs) {
									if (err) {
										console.log(err);
									} else {
										docs = JSON.parse(JSON.stringify(docs));
										route(res, 200, 'OK', 'text/html', admin, {
											fname: docs.fname,
											lname: docs.lname
										});
									}
								});
							} else if (cookieVal.startsWith('EMPTE')) {
								res.writeHead(302, { Location: '/teacher' });
								res.end();
							} else {
								res.writeHead(302, { Location: '/login' });
								res.end();
							}
						} else {
							res.writeHead(302, { Location: '/logout' });
							res.end();
						}
					}
				});
			} catch (e) {
				res.writeHead(302, { Location: '/login' });
				res.end();
			}
		} else if (path == '/teacher') {
			try {
				var cookieVal = readCookie(req, 'id');
				User.exists({ cookie: cookieVal }, function(err, docs) {
					if (err) {
						route(res, 200, 'OK', 'text/html', `Please try again later`, {});
					} else {
						if (docs) {
							if (cookieVal.startsWith('EMPTE')) {
								User.findOne({ cookie: cookieVal }, function(err, docs) {
									if (err) {
										console.log(err);
									} else {
										docs = JSON.parse(JSON.stringify(docs));
										route(res, 200, 'OK', 'text/html', teacher, {
											fname: docs.fname,
											lname: docs.lname,
											employee_id: docs.employee_id,
											email_id: docs.email_id
										});
									}
								});
							} else if (cookieVal.startsWith('EMPAD')) {
								res.writeHead(302, { Location: '/admin' });
								res.end();
							} else {
								res.writeHead(302, { Location: '/login' });
								res.end();
							}
						} else {
							res.writeHead(302, { Location: '/logout' });
							res.end();
						}
					}
				});
			} catch (e) {
				res.writeHead(302, { Location: '/login' });
				res.end();
			}
		} else if (path.startsWith('/teacher/requests')) {
			try {
				var cookieVal = readCookie(req, 'id');
				User.exists({ cookie: cookieVal }, function(err, docs) {
					if (err) {
						route(res, 200, 'OK', 'text/html', `Please try again later`, {});
					} else {
						if (docs) {
							if (cookieVal.startsWith('EMPTE')) {
								var employee_id = q.query.empid;
								var email_id = q.query.email;
								Request.find({ employee_id: employee_id, email_id: email_id })
									.then(docs =>
										route(res, 200, 'OK', 'text/html', JSON.stringify(docs), {})
									)
									.catch(e => console.error(e));
							} else {
								route(res, 200, 'OK', 'text/html', JSON.stringify([]), {});
							}
						} else {
							route(res, 200, 'OK', 'text/html', JSON.stringify([]), {});
						}
					}
				});
			} catch (e) {
				route(res, 200, 'OK', 'text/html', JSON.stringify([]), {});
			}
		} else if (path.startsWith('/teacher2/requests2/status')) {
			try {
				var cookieVal = readCookie(req, 'id');
				User.exists({ cookie: cookieVal }, function(err, docs) {
					if (err) {
						route(res, 200, 'OK', 'text/html', `Please try again later`, {});
					} else {
						if (docs) {
							if (cookieVal.startsWith('EMPTE')) {
								var employee_id = q.query.empid;
								var email_id = q.query.email;
                var status = q.query.status;
								Request.find({ employee_id: employee_id, email_id: email_id, status: status })
									.then(docs =>
										route(res, 200, 'OK', 'text/html', JSON.stringify(docs), {})
									)
									.catch(e => console.error(e));
							} else {
								route(res, 200, 'OK', 'text/html', JSON.stringify([]), {});
							}
						} else {
							route(res, 200, 'OK', 'text/html', JSON.stringify([]), {});
						}
					}
				});
			} catch (e) {
				route(res, 200, 'OK', 'text/html', JSON.stringify([]), {});
			}
		}else if (path.startsWith('/admin/all')) {
			try {
				var cookieVal = readCookie(req, 'id');
				User.exists({ cookie: cookieVal }, function(err, docs) {
					if (err) {
						route(res, 200, 'OK', 'text/html', `Please try again later`, {});
					} else {
						if (docs) {
							if (cookieVal.startsWith('EMPAD')) {
								var mode = q.query.mode;
								var obj;
								if (mode == 'stock') {
									Item.find({})
										.then(docs =>
											route(
												res,
												200,
												'OK',
												'text/html',
												JSON.stringify(docs),
												{}
											)
										)
										.catch(e => console.error(e));
								} else if (mode == 'eqreq') {
									Request.find({ status: 'Pending' })
										.then(docs =>
											route(
												res,
												200,
												'OK',
												'text/html',
												JSON.stringify(docs),
												{}
											)
										)
										.catch(e => console.error(e));
								} else if (mode == 'db') {
									User.find({})
										.then(docs =>
											route(
												res,
												200,
												'OK',
												'text/html',
												JSON.stringify(docs),
												{}
											)
										)
										.catch(e => console.error(e));
								} else if (mode == 'summary') {
									Summary.find({})
										.then(docs =>
											route(
												res,
												200,
												'OK',
												'text/html',
												JSON.stringify(docs),
												{}
											)
										)
										.catch(e => console.error(e));
								} else if (mode == 'purchase') {
									Request.find({ status: 'Rejected' })
										.then(docs =>
											route(
												res,
												200,
												'OK',
												'text/html',
												JSON.stringify(docs),
												{}
											)
										)
										.catch(e => console.error(e));
								} else {
									obj = [];
									route(res, 200, 'OK', 'text/html', JSON.stringify(obj), {});
								}
							} else {
								route(res, 200, 'OK', 'text/html', JSON.stringify([]), {});
							}
						} else {
							route(res, 200, 'OK', 'text/html', JSON.stringify([]), {});
						}
					}
				});
			} catch (e) {
				route(res, 200, 'OK', 'text/html', JSON.stringify([]), {});
			}
		} else if (path == '/admin/count') {
			var pc = q.query.pc;
			var data = '';
			var count1, count2, count3, count4;
			Item.countDocuments(
				{ product_category: pc, status: 'Inventory' },
				function(err, count) {
					data = data + 'Inventory : ' + count;
					count1 = count;
					Item.countDocuments(
						{ product_category: pc, status: 'In Use' },
						function(err, count) {
							data = data + ' In Use : ' + count;
							count2 = count;
							Item.countDocuments(
								{ product_category: pc, status: 'Discarded' },
								function(err, count) {
									data = data + ' Discarded : ' + count;
									count3 = count;
									Item.countDocuments(
										{ product_category: pc, status: 'Repair' },
										function(err, count) {
											data = data + ' Repair : ' + count;
											count4 = count;
											Summary.updateOne(
												{ product_category: pc },
												{
													inventory_stat: count1,
													in_use_stat: count2,
													discarded_stat: count3,
													repair_stat: count4
												},
												function(err, docs) {
													if (err) {
														console.log(err);
													} else {
														route(res, 200, 'OK', 'text/html', data + '', {});
													}
												}
											);
										}
									);
								}
							);
						}
					);
				}
			);
		} else if (path.startsWith('/admin/dashboard')) {
			try {
				var cookieVal = readCookie(req, 'id');
				User.exists({ cookie: cookieVal }, function(err, docs) {
					if (err) {
						route(res, 200, 'OK', 'text/html', `Please try again later`, {});
					} else {
						if (docs) {
							if (cookieVal.startsWith('EMPAD')) {
								var mode = q.query.mode;
								var val = q.query.val;
								var obj;
								if (mode == 'stock') {
									Item.find({ $text: { $search: val } })
										.sort({ score: { $meta: 'textScore' } })
										.then(docs =>
											route(
												res,
												200,
												'OK',
												'text/html',
												JSON.stringify(docs),
												{}
											)
										)
										.catch(e => console.error(e));
								} else if (mode == 'eqreq') {
									Request.find({ $text: { $search: val } })
										.sort({ score: { $meta: 'textScore' } })
										.then(docs =>
											route(
												res,
												200,
												'OK',
												'text/html',
												JSON.stringify(docs),
												{}
											)
										)
										.catch(e => console.error(e));
								} else if (mode == 'db') {
									User.find({ $text: { $search: val } })
										.sort({ score: { $meta: 'textScore' } })
										.then(docs =>
											route(
												res,
												200,
												'OK',
												'text/html',
												JSON.stringify(docs),
												{}
											)
										)
										.catch(e => console.error(e));
								} else if (mode == 'summary') {
									Summary.find({ $text: { $search: val } })
										.sort({ score: { $meta: 'textScore' } })
										.then(docs =>
											route(
												res,
												200,
												'OK',
												'text/html',
												JSON.stringify(docs),
												{}
											)
										)
										.catch(e => console.error(e));
								} else if (mode == 'purchase') {
									Request.find({ $text: { $search: val } })
										.sort({ score: { $meta: 'textScore' } })
										.then(docs =>
											route(
												res,
												200,
												'OK',
												'text/html',
												JSON.stringify(docs),
												{}
											)
										)
										.catch(e => console.error(e));
								} else {
									obj = [];
									route(res, 200, 'OK', 'text/html', JSON.stringify(obj), {});
								}
							} else {
								route(res, 200, 'OK', 'text/html', JSON.stringify([]), {});
							}
						} else {
							route(res, 200, 'OK', 'text/html', JSON.stringify([]), {});
						}
					}
				});
			} catch (e) {
				route(res, 200, 'OK', 'text/html', JSON.stringify([]), {});
			}
		} else if (path.startsWith('/teacher/eqreqs')) {
			try {
				var cookieVal = readCookie(req, 'id');
				User.exists({ cookie: cookieVal }, function(err, docs) {
					if (err) {
						route(res, 200, 'OK', 'text/html', `Please try again later`, {});
					} else {
						if (docs) {
							if (cookieVal.startsWith('EMPTE')) {
								var emp = q.query.empid;
								var email_id = q.query.email;
								route(res, 200, 'OK', 'text/html', blank1, {
									value: 'Request Status',
									emp: emp,
									email_id: email_id
								});
							} else {
								res.writeHead(302, { Location: '/logout' });
								res.end();
							}
						} else {
							res.writeHead(302, { Location: '/logout' });
							res.end();
						}
					}
				});
			} catch (e) {
				res.writeHead(302, { Location: '/login' });
				res.end();
			}
		} else if (path.startsWith('/admin')) {
			try {
				var cookieVal = readCookie(req, 'id');
				User.exists({ cookie: cookieVal }, function(err, docs) {
					if (err) {
						route(res, 200, 'OK', 'text/html', `Please try again later`, {});
					} else {
						if (docs) {
							if (cookieVal.startsWith('EMPAD')) {
								var value = path.substring(7);
								if (value == 'stock') {
									var tableh = `<tr>
                                    <th scope="col"
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                        Product ID
                                    </th>
                                    <th scope="col"
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                        Product Category
                                    </th>
                                    <th scope="col"
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                        Brand
                                    </th>
                                    <th scope="col"
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                        Price
                                    </th>
                                    <th scope="col"
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                        Supplier
                                    </th>
                                    <th scope="col"
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                        Purchase Date
                                    </th>
                                    <th scope="col"
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                        Bill ID
                                    </th>
                                    <th scope="col"
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                        Employee Name
                                    </th>                                    
                                    <th scope="col"
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                        Employee ID
                                    </th> 
                                    <th scope="col"
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                        Install Place
                                    </th>   
                                    <th scope="col"
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                        Issue Date
                                    </th>
                                    <th scope="col"
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                        Status
                                     </th>                                
                                     <th scope="col" class="relative px-6 py-3">
                                        <span class="sr-only">Edit</span>
                                     </th>
                                </tr>`;
									var tableb = `<tr>
                                    <td class="px-6 py-4">
                                      <div class="flex items-center space-x-3 text-center">
                                          <div>
                                              <span class="">
                                              \${(docs[i].product_id)}
                                              </span>
                                          </div>
                                      </div>
                                  </td>
                                  <td class="px-6 py-4 text-center">
                                      <span class="">
                                      \${(docs[i].product_category)}
                                      </span>
                                      <p class="text-gray-500 text-sm font-semibold tracking-wide">
                                      \${(docs[i].product_type)}
                                      </p>
                                  </td>
                                  <td class="px-6 py-4 text-center">
                                      <span class="text-green-800 bg-green-200 font-semibold px-2 rounded-full">
                                      \${(docs[i].brand)}
                                      </span>
                                  </td>
                                  <td class="px-6 py-4 text-center">
                                      Rs. \${(docs[i].price)}
                                  </td>
                                  <td class="px-6 py-4 text-center">
                                  \${(docs[i].supplier)}
                                  </td>
                                  <td class="px-6 py-4 text-center">
                                  \${(docs[i].purchase_date)}
                                  </td>
                                  <td class="px-6 py-4 text-center">
                                  \${(docs[i].transaction_id)}
                                  </td>
                                  <td class="px-6 py-4 text-center">
                                  \${(docs[i].fname)} \${(docs[i].lname)}
                                  </td>
                                  <td class="px-6 py-4 text-center">
                                  \${(docs[i].employee_id)}
                                  </td>
                                  <td class="px-6 py-4 text-center">
                                  \${(docs[i].installation_place)}
                                  </td>
                                  <td class="px-6 py-4 text-center">
                                  \${(docs[i].issue_date)}
                                  </td>
                                  <td class="px-6 py-4 text-center" id="statusInven">
                                  \${(docs[i].status)}
                                  </td>
                                  <td class="px-6 py-4 text-center">
                                    <button data-bs-toggle="modal" data-bs-target="#exampleModal"  name="search" class="uppercase px-3 py-2 rounded-full bg-green-600 text-blue-50 max-w-max shadow-sm hover:shadow-lg focus:outline-none" onclick="document.getElementById('uniquevalue').value='\${(docs[i]._id)}';document.getElementById('dropdownMenuButton2').innerHTML='\${(docs[i].status)}';document.getElementById('statusInvenVal').value='\${(docs[i].status)}';document.getElementById('product_categoryhidden').value='\${(docs[i].product_category)}'">Edit</button>
                                    <button data-bs-toggle="modal" data-bs-target="#exampleModal2"  name="search" class="uppercase px-3 py-2 rounded-full bg-red-600 text-blue-50 max-w-max shadow-sm hover:shadow-lg focus:outline-none" onclick="document.getElementById('hiddenvalue').value='\${(docs[i]._id)}';document.getElementById('hiddencategory').value='\${(docs[i].product_category)}'">Del</button>
                                  </td>
                                  </tr>`;
									route(res, 200, 'OK', 'text/html', blank2, {
										value: 'Products',
										tableh: tableh,
										tableb: tableb,
										mode: 'stock'
									});
								} else if (value == 'eqprequests') {
									var tableh = `<tr>
                                        <th scope="col"
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                            Employee Name
                                        </th>
                                        <th scope="col"
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                            Employee ID
                                        </th>
                                        <th scope="col"
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                            Email ID
                                        </th>
                                        <th scope="col"
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                            Product Category
                                        </th>
                                        <th scope="col"
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                            Quantity Required
                                        </th>
                                        <th scope="col"
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                            In Stock ?
                                        </th>
                                        <th scope="col"
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                            Installation Place
                                        </th>
                                        <th scope="col" class="relative px-6 py-3">
                                            <span class="sr-only">Edit</span>
                                        </th>
                                    </tr>`;
									var tableb = `<tr>
                                        <td class="px-6 py-4">
                                          <div class="flex items-center space-x-3 text-center">
                                              <div>
                                                  <span class="">
                                                  \${(docs[i].fname)} \${(docs[i].lname)}
                                                  </span>
                                              </div>
                                          </div>
                                      </td>
                                      <td class="px-6 py-4 text-center">
                                          <span class="text-green-800 bg-green-200 font-semibold px-2 rounded-full">
                                          \${(docs[i].employee_id)}
                                          </span>
                                      </td>
                                      <td class="px-6 py-4 text-center">
                                      \${(docs[i].email_id)}
                                      </td>
                                      <td class="px-6 py-4 text-center">
                                        <span class="">
                                        \${(docs[i].product_category)}
                                        </span>
                                        <p class="text-gray-500 text-sm font-semibold tracking-wide">
                                        \${(docs[i].product_type)}
                                        </p>
                                      </td>
                                      <td class="px-6 py-4 text-center">
                                      \${(docs[i].quantity_required)}
                                      </td>
                                      <td class="px-6 py-4 text-center">
                                      <a class="btn btn-primary" href="/admin/summary" target="_blank">Check</a>
                                      </td>
                                      <td class="px-6 py-4 text-center">
                                      \${(docs[i].installation_place)}
                                      </td>
                                      <td class="px-6 py-4 text-center">
                                        <button data-bs-toggle="modal" data-bs-target="#exampleModal3" name="search" class="uppercase px-3 py-2 rounded-full bg-blue-600 text-blue-50 max-w-max shadow-sm hover:shadow-lg focus:outline-none" onclick="document.getElementById('hiddenvalue2').value='\${(docs[i]._id)}'">Option</button>
                                      </td>
                                      </tr>`;
									route(res, 200, 'OK', 'text/html', blank2, {
										value: 'Equipment Requests',
										tableh: tableh,
										tableb: tableb,
										mode: 'eqreq'
									});
								} else if (value == 'database') {
									var tableh = `<tr>
                                        <th scope="col"
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                            Employee ID
                                        </th>
                                        <th scope="col"
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                            First Name
                                        </th>
                                        <th scope="col"
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                            Last Name
                                        </th>
                                        <th scope="col"
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                            Designation
                                        </th>
                                        <th scope="col"
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                            Lab No.
                                        </th>
                                        <th scope="col"
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                            Email ID
                                        </th>
                                        <th scope="col" class="relative px-6 py-3">
                                            <span class="sr-only">Edit</span>
                                        </th>
                                    </tr>`;
									var tableb = `<tr>
                                        <td class="px-6 py-4 text-center">
                                        <input type="hidden" id="empid" value="\${(docs[i].employee_id)}"
                                            <span class="text-green-800 bg-green-200 font-semibold px-2 rounded-full">
                                            \${(docs[i].employee_id)}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 text-center">
                                        <span class="">
                                        \${(docs[i].fname)}
                                        </span>
                                        </td>
                                      <td class="px-6 py-4 text-center">
                                      <span class="">
                                      \${(docs[i].lname)}
                                      </span>
                                      </td>
                                      <td class="px-6 py-4 text-center">
                                        <span class="">
                                        \${(docs[i].designation)}
                                        </span>
                                      </td>
                                      <td class="px-6 py-4 text-center">
                                      \${(docs[i].lab_no)}
                                      </td>
                                      <td class="px-6 py-4 text-center">
                                      \${(docs[i].email_id)}
                                      </td>
                                      <td class="px-6 py-4 text-center">
                                      <button data-bs-toggle="modal" data-bs-target="#exampleModal"  name="search" class="uppercase px-3 py-2 rounded-full bg-green-600 text-blue-50 max-w-max shadow-sm hover:shadow-lg focus:outline-none" onclick="document.getElementById('uniquevalue').value='\${(docs[i]._id)}';$('#employee_id').val('\${(docs[i].employee_id)}');$('#designation').val('\${(docs[i].designation)}');$('#email_id').val('\${(docs[i].email_id)}');">Edit</button>
                                      <button data-bs-toggle="modal" data-bs-target="#exampleModal2"  name="search" class="uppercase px-3 py-2 rounded-full bg-red-600 text-blue-50 max-w-max shadow-sm hover:shadow-lg focus:outline-none" onclick="document.getElementById('hiddenvalue').value='\${(docs[i]._id)}'">Del</button>
                                      </td>
                                      </tr>`;
									route(res, 200, 'OK', 'text/html', blank2, {
										value: 'View User Details',
										tableh: tableh,
										tableb: tableb,
										mode: 'db'
									});
								} else if (value == 'summary') {
									var tableh = `<tr>
                                        <th scope="col"
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                            Product Type
                                        </th>
                                        <th scope="col"
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                            Product Category
                                        </th>
                                        <th scope="col"
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                            Quantity Purchased
                                        </th>
                                        <th scope="col"
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center" style="color:blue">
                                            Inventory
                                        </th>
                                        <th scope="col"
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center" style="color:green">
                                            In Use
                                        </th>
                                        <th scope="col"
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center" style="color:red">
                                            Discarded
                                        </th>
                                        <th scope="col"
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center" style="color:orange">
                                            Repair
                                        </th>
                                    </tr>`;
									var tableb = `<tr>
                                        <td class="px-6 py-4 text-center">
                                        <input type="hidden" id="empid" value="\${(docs[i].employee_id)}"
                                            <span class="text-green-800 bg-green-200 font-semibold px-2 rounded-full">
                                            \${(docs[i].product_type)}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 text-center">
                                        <span class="">
                                        \${(docs[i].product_category)}
                                        </span>
                                        </td>
                                      <td class="px-6 py-4 text-center">
                                      <span class="">
                                      \${(docs[i].quantity_purchased)}
                                      </span>
                                      </td>
                                      <td class="px-6 py-4 text-center">
                                        <span class="">
                                        \${(docs[i].inventory_stat)}
                                        </span>
                                      </td>
                                      <td class="px-6 py-4 text-center">
                                      \${(docs[i].in_use_stat)}
                                      </td>
                                      <td class="px-6 py-4 text-center">
                                      \${(docs[i].discarded_stat)}
                                      </td>
                                      <td class="px-6 py-4 text-center">
                                      \${(docs[i].repair_stat)}
                                      </td>
                                      </tr>`;
									route(res, 200, 'OK', 'text/html', itemsSummary, {
										tableh: tableh,
										tableb: tableb,
										mode: 'summary'
									});
								} else if (value == 'purchase') {
									var tableh = `<tr>                                      
                                        <th scope="col"
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                            Product Category
                                        </th>
                                        <th scope="col"
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                            Quantity Required
                                        </th>
                                        <th scope="col"
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                            In Stock ?
                                        </th>
                                        <th scope="col" class="relative px-6 py-3">
                                            <span class="sr-only">Edit</span>
                                        </th>
                                    </tr>`;
									var tableb = `<tr>
                                      <td class="px-6 py-4 text-center">
                                        <span class="">
                                        \${(docs[i].product_category)}
                                        </span>
                                        <p class="text-gray-500 text-sm font-semibold tracking-wide">
                                        \${(docs[i].product_type)}
                                        </p>
                                      </td>
                                      <td class="px-6 py-4 text-center">
                                      \${(docs[i].quantity_required)}
                                      </td>
                                      <td class="px-6 py-4 text-center">
                                      <a class="btn btn-primary" href="/admin/summary" target="_blank">Check</a>
                                      </td>
                                      <td class="px-6 py-4 text-center">                                      
                                      <button data-bs-toggle="modal" data-bs-target="#exampleModal2" class="uppercase px-3 py-2 rounded-full bg-red-600 text-blue-50 max-w-max shadow-sm hover:shadow-lg focus:outline-none" onclick="document.getElementById('hiddendelete').value='\${(docs[i]._id)}'">Del</button>
                                      </td>
                                      </tr>`;
									route(res, 200, 'OK', 'text/html', rejecteditem, {
										tableh: tableh,
										tableb: tableb,
										mode: 'purchase'
									});
								} else {
									route(
										res,
										404,
										'Page Not Found',
										'text/html',
										`No Page Found ${req.url} is not available`,
										{}
									);
								}
							} else {
								res.writeHead(302, { Location: '/logout' });
								res.end();
							}
						} else {
							res.writeHead(302, { Location: '/logout' });
							res.end();
						}
					}
				});
			} catch (e) {
				res.writeHead(302, { Location: '/login' });
				res.end();
			}
		} else if (path == '/auth') {
			route(res, 200, 'OK', 'text/html', auth, {});
		} else if (path.startsWith('/image')) {
			imageRenderer('.' + path, res);
		} else if (path.startsWith('/css')) {
			cssRenderer('.' + path, res);
		} else if (path.startsWith('/js')) {
			javascriptRenderer('.' + path, res);
		} else {
			route(
				res,
				404,
				'Page Not Found',
				'text/html',
				`No Page Found ${req.url} is not available`,
				{}
			);
		}
		//---------------------------------------------------------------
	} else if (req.method == 'POST') {
		if (path == '/login') {
			post(req, res, function(body) {
				var post = JSON.parse(body);
				console.log(post);
				if (!(post.employee_id == '' || post.password == '')) {
					const hash_pass = crypto
						.createHash('sha256')
						.update(post.password)
						.digest('base64');
					User.exists(
						{ employee_id: post.employee_id, password: hash_pass },
						function(err, docs) {
							if (err) {
								route(
									res,
									200,
									'OK',
									'text/html',
									`Please try again later`,
									{}
								);
							} else {
								if (docs) {
									User.findOne(
										{ employee_id: post.employee_id, password: hash_pass },
										function(err, docs) {
											if (err) {
												console.log(err);
											} else {
												docs = JSON.parse(JSON.stringify(docs));
												console.log(docs);
												if (docs.status == 'Active') {
													res.setHeader(
														'Set-Cookie',
														`id=${docs.cookie}; Max-Age=3000; HttpOnly, Secure`
													);
													if (docs.designation == 'Admin') {
														route(res, 200, 'OK', 'text/html', '/admin', {});
													} else {
														route(res, 200, 'OK', 'text/html', '/teacher', {});
													}
												} else if (docs.status == 'Disabled') {
													route(
														res,
														200,
														'OK',
														'text/html',
														`Temporarily Disabled`,
														{}
													);
												} else {
													route(
														res,
														200,
														'OK',
														'text/html',
														`Please contact administrator`,
														{}
													);
												}
											}
										}
									);
								} else {
									route(
										res,
										200,
										'OK',
										'text/html',
										'Invalid Username or Password',
										{}
									);
								}
							}
						}
					);
				} else {
					route(res, 200, 'OK', 'text/html', 'Empty Username or Password', {});
				}
			});
		} else if (path == '/auth/employee') {
			post(req, res, function(body) {
				var post = JSON.parse(body);
				console.log(post);
				if (!(post.employee_id == '')) {
					User.exists({ employee_id: post.employee_id }, function(err, docs) {
						if (err) {
							route(res, 200, 'OK', 'text/html', `Please try again later`, {});
						} else {
							if (docs) {
								User.findOne({ employee_id: post.employee_id }, function(
									err,
									docs
								) {
									if (err) {
										console.log(err);
									} else {
										docs = JSON.parse(JSON.stringify(docs));
										if (docs.status == 'Active') {
											route(
												res,
												200,
												'OK',
												'text/html',
												`You are already registered`,
												{}
											);
										} else if (docs.status == 'Non-Active') {
											route(
												res,
												200,
												'OK',
												'text/html',
												`/register?emp=${docs.employee_id}`,
												{}
											);
										} else {
											route(
												res,
												200,
												'OK',
												'text/html',
												`Your account is disabled`,
												{}
											);
										}
									}
								});
							} else {
								route(
									res,
									200,
									'OK',
									'text/html',
									`You are not authorized`,
									{}
								);
							}
						}
					});
				} else {
					route(res, 200, 'OK', 'text/html', 'Empty Employee ID', {});
				}
			});
		} else if (path == '/register') {
			post(req, res, function(body) {
				var post = JSON.parse(body);
				console.log(post);
				if (!(post.employee_id == '' || post.fname == '' || post.lname == '' || post.password == '' || post.email_id == '' || post.lab_no == '')) {
          User.exists(
						{ email_id: post.email_id },
						function(err, docs) {
							if (err) {
								route(
									res,
									200,
									'OK',
									'text/html',
									`Please try again later`,
									{}
								);
							} 
              else {
								if (docs) {route(
										res,
										200,
										'OK',
										'text/html',
										`Email ID already used`,
										{}
									);}
                else{
                  User.exists(
						{ employee_id: post.employee_id, status: 'Non-Active' },
						function(err, docs) {
							if (err) {
								route(
									res,
									200,
									'OK',
									'text/html',
									`Please try again later`,
									{}
								);
							} else {
								if (docs) {
									const hash_pass = crypto
										.createHash('sha256')
										.update(post.password)
										.digest('base64');
									User.updateOne(
										{ employee_id: post.employee_id, status: 'Non-Active' },
										{
											fname: post.fname,
											lname: post.lname,
											password: hash_pass,
											email_id: post.email_id,
											lab_no: post.lab_no,
											status: 'Active',
											cookie: post.employee_id + post.lab_no
										},
										function(err, docs) {
											if (err) {
												console.log(err);
											} else {
												route(
													res,
													200,
													'OK',
													'text/html',
													`You are registered now`,
													{}
												);
											}
										}
									);
								} else {
									route(
										res,
										200,
										'OK',
										'text/html',
										`You are not authorized`,
										{}
									);
								}
							}
						}
					);
                }
                }});	
				} else {
					route(res, 200, 'OK', 'text/html', 'Empty Fields', {});
				}
			});
		} else if (path == '/admin/allowemployee') {
			post(req, res, function(body) {
				try {
					var cookieVal = readCookie(req, 'id');
					User.exists({ cookie: cookieVal }, function(err, docs) {
						if (err) {
							route(res, 200, 'OK', 'text/html', `Please try again later`, {});
						} else {
							if (docs) {
								if (cookieVal.startsWith('EMPAD')) {
									var post = JSON.parse(body);
									console.log(post);
									if (!(post.employee_id == '' || post.designation == '')) {
										User.exists({ employee_id: post.employee_id }, function(
											err,
											docs
										) {
											if (err) {
												route(
													res,
													200,
													'OK',
													'text/html',
													`Please try again later`,
													{}
												);
											} else {
												if (!docs) {
													User.insertMany(
														{
															employee_id: post.employee_id,
															designation: post.designation,
															status: 'Non-Active',
															fname: '-',
															lname: '-',
															password: '-',
															email_id: '-',
															lab_no: '-',
															cookie: '-'
														},
														function(err, result) {
															if (err) {
																res.end(err);
															} else {
																route(
																	res,
																	200,
																	'OK',
																	'text/html',
																	'Employee ID Allowed',
																	{}
																);
															}
														}
													);
												} else {
													route(
														res,
														200,
														'OK',
														'text/html',
														'Employee ID already allowed',
														{}
													);
												}
											}
										});
									} else {
										route(res, 200, 'OK', 'text/html', 'Empty Fields', {});
									}
								} else {
									route(res, 200, 'OK', 'text/html', 'You are not admin', {});
								}
							} else {
								route(res, 200, 'OK', 'text/html', 'No such Admin found', {});
							}
						}
					});
				} catch (e) {
					route(res, 200, 'OK', 'text/html', 'Please Login As Admin', {});
				}
			});
		} else if (path == '/admin/addproducts') {
			post(req, res, function(body) {
				try {
					var cookieVal = readCookie(req, 'id');
					User.exists({ cookie: cookieVal }, function(err, docs) {
						if (err) {
							route(res, 200, 'OK', 'text/html', `Please try again later`, {});
						} else {
							if (docs) {
								if (cookieVal.startsWith('EMPAD')) {
									var post = JSON.parse(body);
									console.log(post);
									if (
										!(
											post.product_id == '' ||
											post.product_category == '' ||
											post.product_type == '' ||
											post.brand == '' ||
											post.price == '' ||
											post.supplier == '' ||
											post.purchase_date == '' ||
											post.transaction_id == ''
										)
									) {
										Item.insertMany(
											{
												product_category: post.product_category,
												product_type: post.product_type,
												brand: post.brand,
												price: post.price,
												supplier: post.supplier,
												purchase_date: post.purchase_date,
												transaction_id: post.transaction_id,
												product_id: post.product_id,
												employee_id: '-',
												fname: '-',
												lname: '-',
												installation_place: '-',
												issue_date: '-',
												status: 'Inventory'
											},
											function(err, result) {
												if (err) {
													res.end(err);
												} else {
													Summary.exists(
														{ product_category: post.product_category },
														function(err, docs) {
															if (err) {
																route(
																	res,
																	200,
																	'OK',
																	'text/html',
																	`Please try again later`,
																	{}
																);
															} else {
																if (docs) {
																	Summary.findOne(
																		{ product_category: post.product_category },
																		function(err, docs) {
																			if (err) {
																				console.log(err);
																			} else {
																				docs2 = JSON.parse(
																					JSON.stringify(docs)
																				);
																				console.log(docs2);
																				Summary.updateOne(
																					{
																						product_category:
																							post.product_category
																					},
																					{
																						quantity_purchased:
																							parseInt(
																								docs2.quantity_purchased
																							) + 1
																					},
																					function(err, docs) {
																						if (err) {
																							console.log(err);
																							route(
																								res,
																								200,
																								'OK',
																								'text/html',
																								'Please try again Later',
																								{}
																							);
																						} else {
																							updateCount(
																								post.product_category
																							);
																							route(
																								res,
																								200,
																								'OK',
																								'text/html',
																								'Product Details Added',
																								{}
																							);
																						}
																					}
																				);
																			}
																		}
																	);
																} else {
																	Summary.insertMany(
																		{
																			product_category: post.product_category,
																			product_type: post.product_type,
																			quantity_purchased: '1'
																		},
																		function(err, result) {
																			if (err) {
																				res.end(err);
																			} else {
																				updateCount(post.product_category);
																				route(
																					res,
																					200,
																					'OK',
																					'text/html',
																					'Product Details Added',
																					{}
																				);
																			}
																		}
																	);
																}
															}
														}
													);
												}
											}
										);
									} else {
										route(res, 200, 'OK', 'text/html', 'Empty Fields', {});
									}
								} else {
									route(res, 200, 'OK', 'text/html', 'You are not admin', {});
								}
							} else {
								route(res, 200, 'OK', 'text/html', 'No such Admin found', {});
							}
						}
					});
				} catch (e) {
					route(res, 200, 'OK', 'text/html', 'Please Login As Admin', {});
				}
			});
		} else if (path == '/admin/updateusers') {
			post(req, res, function(body) {
				try {
					var cookieVal = readCookie(req, 'id');
					User.exists({ cookie: cookieVal }, function(err, docs) {
						if (err) {
							route(res, 200, 'OK', 'text/html', `Please try again later`, {});
						} else {
							if (docs) {
								if (cookieVal.startsWith('EMPAD')) {
									var post = JSON.parse(body);
									console.log(post);
									User.updateOne(
										{ _id: post._id },
										{
											employee_id: post.employee_id,
											fname: post.fname,
											lname: post.lname,
											email_id: post.email_id,
											lab_no: post.lab_no,
											cookie: post.employee_id + post.lab_no
										},
										function(err, docs) {
											if (err) {
												console.log(err);
												route(
													res,
													200,
													'OK',
													'text/html',
													'Please try again Later',
													{}
												);
											} else {
												route(
													res,
													200,
													'OK',
													'text/html',
													'User Details Updated',
													{}
												);
											}
										}
									);
								} else {
									route(res, 200, 'OK', 'text/html', 'You are not admin', {});
								}
							} else {
								route(res, 200, 'OK', 'text/html', 'No such Admin found', {});
							}
						}
					});
				} catch (e) {
					route(res, 200, 'OK', 'text/html', 'Please login as Admin', {});
				}
			});
		} else if (path == '/admin/updateproducts') {
			post(req, res, function(body) {
				try {
					var cookieVal = readCookie(req, 'id');
					User.exists({ cookie: cookieVal }, function(err, docs) {
						if (err) {
							route(res, 200, 'OK', 'text/html', `Please try again later`, {});
						} else {
							if (docs) {
								if (cookieVal.startsWith('EMPAD')) {
									var post = JSON.parse(body);
									console.log(post);
									if (
										!(
											post.employee_id == '' ||
											post.fname == '' ||
											post.lname == '' ||
											post.installation_place == '' ||
											post.issue_date == '' ||
											post.status == ''
										)
									) {
										Item.updateOne(
											{ _id: post._id },
											{
												employee_id: post.employee_id,
												fname: post.fname,
												lname: post.lname,
												installation_place: post.installation_place,
												issue_date: post.issue_date,
												status: post.status
											},
											function(err, docs) {
												if (err) {
													console.log(err);
													route(
														res,
														200,
														'OK',
														'text/html',
														'Please try again Later',
														{}
													);
												} else {
													updateCount(post.product_category.trim());
													route(
														res,
														200,
														'OK',
														'text/html',
														'Product Details Updated',
														{}
													);
												}
											}
										);
									} else {
										route(res, 200, 'OK', 'text/html', 'Empty Fields', {});
									}
								} else {
									route(res, 200, 'OK', 'text/html', 'You are not admin', {});
								}
							} else {
								route(res, 200, 'OK', 'text/html', 'No such Admin found', {});
							}
						}
					});
				} catch (e) {
					route(res, 200, 'OK', 'text/html', 'Please login as Admin', {});
				}
			});
		} else if (path == '/admin/deleteuser') {
			post(req, res, function(body) {
				try {
					var cookieVal = readCookie(req, 'id');
					User.exists({ cookie: cookieVal }, function(err, docs) {
						if (err) {
							route(res, 200, 'OK', 'text/html', `Please try again later`, {});
						} else {
							if (docs) {
								if (cookieVal.startsWith('EMPAD')) {
									var post = JSON.parse(body);
									console.log(post);
									User.deleteOne({ _id: post._id }, function(err) {
										if (err) {
											console.log(err);
										} else {
											Request.deleteOne({ employee_id: post.empid }, function(
												err
											) {
												if (err) {
													console.log(err);
												} else {
													route(
														res,
														200,
														'OK',
														'text/html',
														'User Details Deleted',
														{}
													);
												}
											});
										}
									});
								} else {
									route(res, 200, 'OK', 'text/html', 'You are not admin', {});
								}
							} else {
								route(res, 200, 'OK', 'text/html', 'No such Admin found', {});
							}
						}
					});
				} catch (e) {
					route(res, 200, 'OK', 'text/html', 'Please login as Admin', {});
				}
			});
		} else if (path == '/admin/deleterejected') {
			post(req, res, function(body) {
				try {
					var cookieVal = readCookie(req, 'id');
					User.exists({ cookie: cookieVal }, function(err, docs) {
						if (err) {
							route(res, 200, 'OK', 'text/html', `Please try again later`, {});
						} else {
							if (docs) {
								if (cookieVal.startsWith('EMPAD')) {
									var post = JSON.parse(body);
									console.log(post);
									Request.deleteOne({ _id: post._id }, function(err) {
										if (err) {
											console.log(err);
										} else {
											route(res, 200, 'OK', 'text/html', 'List Updated', {});
										}
									});
								} else {
									route(res, 200, 'OK', 'text/html', 'You are not admin', {});
								}
							} else {
								route(res, 200, 'OK', 'text/html', 'No such Admin found', {});
							}
						}
					});
				} catch (e) {
					route(res, 200, 'OK', 'text/html', 'Please login as Admin', {});
				}
			});
		} else if (path == '/admin/deleteproduct') {
			post(req, res, function(body) {
				try {
					var cookieVal = readCookie(req, 'id');
					User.exists({ cookie: cookieVal }, function(err, docs) {
						if (err) {
							route(res, 200, 'OK', 'text/html', `Please try again later`, {});
						} else {
							if (docs) {
								if (cookieVal.startsWith('EMPAD')) {
									var post = JSON.parse(body);
									console.log(post);
									Item.deleteOne({ _id: post._id }, function(err) {
										if (err) {
											console.log(err);
										} else {
											Summary.findOne(
												{ product_category: post.product_category },
												function(err, docs) {
													if (err) {
														route(
															res,
															200,
															'OK',
															'text/html',
															'No such category',
															{}
														);
													} else {
														docs2 = JSON.parse(JSON.stringify(docs));
														console.log(docs2);
														quantity_purchasedVal =
															parseInt(docs2.quantity_purchased) - 1;
														if (quantity_purchasedVal == 0) {
															Summary.deleteOne(
																{ product_category: post.product_category },
																function(err) {
																	if (err) {
																		console.log(err);
																	} else {
																		updateCount(post.product_category);
																		route(
																			res,
																			200,
																			'OK',
																			'text/html',
																			'Product Details Deleted',
																			{}
																		);
																	}
																}
															);
														} else {
															Summary.updateOne(
																{ product_category: post.product_category },
																{ quantity_purchased: quantity_purchasedVal },
																function(err, docs) {
																	if (err) {
																		console.log(err);
																		route(
																			res,
																			200,
																			'OK',
																			'text/html',
																			'Please try again Later',
																			{}
																		);
																	} else {
																		updateCount(post.product_category);
																		route(
																			res,
																			200,
																			'OK',
																			'text/html',
																			'Product Details Deleted',
																			{}
																		);
																	}
																}
															);
														}
													}
												}
											);
										}
									});
								} else {
									route(res, 200, 'OK', 'text/html', 'You are not admin', {});
								}
							} else {
								route(res, 200, 'OK', 'text/html', 'No such Admin found', {});
							}
						}
					});
				} catch (e) {
					route(res, 200, 'OK', 'text/html', 'Please login as Admin', {});
				}
			});
		} else if (path == '/admin/reqgrant') {
			post(req, res, function(body) {
				try {
					var cookieVal = readCookie(req, 'id');
					User.exists({ cookie: cookieVal }, function(err, docs) {
						if (err) {
							route(res, 200, 'OK', 'text/html', `Please try again later`, {});
						} else {
							if (docs) {
								if (cookieVal.startsWith('EMPAD')) {
									var post = JSON.parse(body);
									console.log(post);
									Request.updateOne(
										{ _id: post._id },
										{ status: 'Approved' },
										function(err, result) {
											if (err) {
												res.send(err);
											} else {
												Request.findOne({ _id: post._id }, function(err, docs) {
													if (err) {
														console.log(err);
													} else {
														docs = JSON.parse(JSON.stringify(docs));
														console.log(docs);
														var sub = 'Equipment Request Approved';
														var body_html = `Hey ${docs.fname} ${
															docs.lname
														}, your equipment request for ${
															docs.product_category
														} has been <b>approved</b>.<br>Please find below the details of equipment requested.<br><table border="2px solid"><tr><td>Quantity Required</td><td>${
															docs.quantity_required
														}</td></tr><tr><td>Place of Installation</td><td>${
															docs.installation_place
														}</td></tr></table>`;
														email_reset_send(docs.email_id, sub, body_html);
														route(
															res,
															200,
															'OK',
															'text/html',
															'Request Granted',
															{}
														);
													}
												});
											}
										}
									);
								} else {
									route(res, 200, 'OK', 'text/html', 'You are not admin', {});
								}
							} else {
								route(res, 200, 'OK', 'text/html', 'No such Admin found', {});
							}
						}
					});
				} catch (e) {
					route(res, 200, 'OK', 'text/html', 'Please login as Admin', {});
				}
			});
		} else if (path == '/admin/reqdeny') {
			post(req, res, function(body) {
				try {
					var cookieVal = readCookie(req, 'id');
					User.exists({ cookie: cookieVal }, function(err, docs) {
						if (err) {
							route(res, 200, 'OK', 'text/html', `Please try again later`, {});
						} else {
							if (docs) {
								if (cookieVal.startsWith('EMPAD')) {
									var post = JSON.parse(body);
									console.log(post);
									Request.updateOne(
										{ _id: post._id },
										{ status: 'Rejected' },
										function(err, result) {
											if (err) {
												res.send(err);
											} else {
												Request.findOne({ _id: post._id }, function(err, docs) {
													if (err) {
														console.log(err);
													} else {
														docs = JSON.parse(JSON.stringify(docs));
														console.log(docs);
														var sub = 'Equipment Request Rejected';
														var body_html = `Hey ${docs.fname} ${
															docs.lname
														}, your equipment request for ${
															docs.product_category
														} has been <b>rejected</b>.<br>Please find below the details of equipment requested.<br><table border="2px solid"><tr><td>Quantity Required</td><td>${
															docs.quantity_required
														}</td></tr><tr><td>Place of Installation</td><td>${
															docs.installation_place
														}</td></tr></table>`;
														email_reset_send(docs.email_id, sub, body_html);
														route(
															res,
															200,
															'OK',
															'text/html',
															'Request Denied',
															{}
														);
													}
												});
											}
										}
									);
								} else {
									route(res, 200, 'OK', 'text/html', 'You are not admin', {});
								}
							} else {
								route(res, 200, 'OK', 'text/html', 'No such Admin found', {});
							}
						}
					});
				} catch (e) {
					route(res, 200, 'OK', 'text/html', 'Please login as Admin', {});
				}
			});
		} else if (path == '/teacher/askreq') {
			post(req, res, function(body) {
				try {
					var cookieVal = readCookie(req, 'id');
					User.exists({ cookie: cookieVal }, function(err, docs) {
						if (err) {
							route(res, 200, 'OK', 'text/html', `Please try again later`, {});
						} else {
							if (docs) {
								if (cookieVal.startsWith('EMPTE')) {
									var post = JSON.parse(body);
									console.log(post);
									if (
										!(
											post.product_category == '' ||
											post.product_type == '' ||
											post.quantity_required == '' ||
											post.installation_place == '' ||
											post.fname == '' ||
											post.lname == '' ||
											post.employee_id == '' ||
											post.email_id == '' ||
											post.status == ''
										)
									) {
										Request.insertMany(
											{
												product_category: post.product_category,
												product_type: post.product_type,
												quantity_required: post.quantity_required,
												installation_place: post.installation_place,
												fname: post.fname,
												lname: post.lname,
												employee_id: post.employee_id,
												email_id: post.email_id,
												status: post.status
											},
											function(err, result) {
												if (err) {
													res.end(err);
												} else {
													route(
														res,
														200,
														'OK',
														'text/html',
														'Equipment Request Sent',
														{}
													);
												}
											}
										);
									}
								} else {
									route(res, 200, 'OK', 'text/html', 'You are not teacher', {});
								}
							} else {
								route(res, 200, 'OK', 'text/html', 'No such Teacher found', {});
							}
						}
					});
				} catch (e) {
					route(res, 200, 'OK', 'text/html', 'Please login as Teacher', {});
				}
			});
		} else if (path == '/resetpass') {
			post(req, res, function(body) {
				var post = JSON.parse(body);
				console.log(post);
				if (!(post.email_id == '')) {
					User.exists({ email_id: post.email_id }, function(err, docs) {
						if (err) {
							route(res, 200, 'OK', 'text/html', `Please try again later`, {});
						} else {
							if (docs) {
								var randomstring = Math.random()
									.toString(36)
									.substr(2, 8);
								const hash_resetcode = crypto
									.createHash('sha256')
									.update(randomstring)
									.digest('base64');
								console.log('Code Emailed : ' + randomstring);
								var sub = 'Verfication Code';
								var body_html = `<h3 style="color:red">Please do not expose this code to anyone</h3><br>You verification code is ${randomstring}`;
								email_reset_send(post.email_id, sub, body_html);
								res.setHeader('Set-Cookie', [
									`verificationToken=${hash_resetcode}`,
									`email=${post.email_id}`
								]);
								route(res, 200, 'OK', 'text/html', code, {});
							} else {
								route(res, 200, 'OK', 'text/html', 'Email not registered', {});
							}
						}
					});
				} else {
					route(res, 200, 'OK', 'text/html', 'Empty email field', {});
				}
			});
		} else if (path == '/verifycode') {
			post(req, res, function(body) {
				try {
					var cookieVal = readCookie(req, 'verificationToken');
					console.log(cookieVal);
					var post = JSON.parse(body);
					console.log(post);
					var hash_code = crypto
						.createHash('sha256')
						.update(post.code)
						.digest('base64');
					console.log(hash_code);
					if (hash_code == cookieVal + '=') {
						var randomstring = Math.random()
							.toString(36)
							.substr(2, 8);
						const hash_pass = crypto
							.createHash('sha256')
							.update(randomstring)
							.digest('base64');
						console.log('Password Emailed : ' + randomstring);
						var email = readCookie(req, 'email');
						User.updateOne(
							{ email_id: email },
							{ password: hash_pass },
							function(err, result) {
								if (err) {
									res.send(err);
								} else {
									var sub = 'New password for Inventory System';
									var body_html =
										'<h2 style="color:blue">Details</h2><br><table border="2px solid"><tr><th>Parameters</th></tr><tr><td>Email ID : ' +
										email +
										'</td></tr><tr><td>Password : ' +
										randomstring +
										'</td></tr></table>';
									email_reset_send(email, sub, body_html);
								}
							}
						);
						route(res, 200, 'OK', 'text/html', 'Password resetted', {});
					} else {
						route(res, 200, 'OK', 'text/html', 'Code is not correct', {});
					}
				} catch (e) {
					res.writeHead(302, { Location: '/forget' });
					res.end();
				}
			});
		}
	}
});
server.listen(port, hostname, () => {
	console.log(chalk.cyanBright('---------------------------------------'));
	console.log(
		chalk.rgb(51, 255, 255)(
			`Server running at http://${hostname}:${port}/ \nOS Type : ${os.type()}\nArchitecture : ${os.arch()}`
		)
	);
	console.log(chalk.cyanBright('---------------------------------------'));
});

// Time Function
function time() {
	let date_ob = new Date();
	let date = ('0' + date_ob.getDate()).slice(-2);
	let month = ('0' + (date_ob.getMonth() + 1)).slice(-2);
	let year = date_ob.getFullYear();
	let hours = date_ob.getHours();
	let minutes = date_ob.getMinutes();
	let seconds = date_ob.getSeconds();
	let time =
		'[' +
		year +
		'-' +
		month +
		'-' +
		date +
		' ' +
		hours +
		':' +
		minutes +
		':' +
		seconds +
		']';
	return time;
}

//Cookie check Function
function readCookie(req, targetCookieName) {
	var cookieString = req.headers.cookie;
	var cookieArr = cookieString.split('; ');

	for (var i = 0; i < cookieArr.length; i++) {
		var cookieNameValue = cookieArr[i].split('=');
		if (cookieNameValue[0] == targetCookieName) {
			return cookieNameValue[1];
		}
	}
	// console.log(cookieArr)
	return 'None';
}

//Css Renderer Function
function cssRenderer(css_name, res) {
	fs.access(css_name, fs.F_OK, err => {
		if (err) {
			console.error(err);
			route(res, 404, 'Page Not Found', 'text/html', 'No such css', {});
		} else {
			const css = fs.readFileSync(css_name);
			route(res, 200, 'OK', 'text/css', css, {});
		}
	});
}

function fileRenderer(filename, res) {
	fs.access(filename, fs.F_OK, err => {
		if (err) {
			console.error(err);
			route(res, 404, 'Page Not Found', 'text/html', 'No such file', {});
		} else {
			const file = fs.readFileSync(filename);
			route(res, 200, 'OK', 'text/html', file, {});
		}
	});
}

//JS Renderer Function
function javascriptRenderer(js_name, res) {
	fs.access(js_name, fs.F_OK, err => {
		if (err) {
			console.error(err);
			route(res, 404, 'Page Not Found', 'text/html', 'No such js', {});
		} else {
			const js = fs.readFileSync(js_name);
			route(res, 200, 'OK', 'text/javascript', js, {});
		}
	});
}

//Image Renderer Function
function imageRenderer(image_name, res) {
	fs.access(image_name, fs.F_OK, err => {
		if (err) {
			console.error(err);
			route(res, 404, 'Page Not Found', 'text/html', 'No such image', {});
		} else {
			const image = fs.readFileSync(image_name);
			if (image_name.endsWith('.jpeg')) {
				route(res, 200, 'OK', 'image/jpeg', image, {});
			} else if (image_name.endsWith('.jpg')) {
				route(res, 200, 'OK', 'image/jpg', image, {});
			} else if (image_name.endsWith('.png')) {
				route(res, 200, 'OK', 'image/png', image, {});
			}
		}
	});
}

// Route Function
function route(res, statCode, statMsg, contType, pageCont, ejsParams) {
	res.statusCode = statCode;
	res.statusMessage = statMsg;
	res.setHeader('Server', 'KaliServer');
	res.setHeader('Content-Type', contType);
	if (contType == 'text/html' && JSON.stringify(ejsParams) != '{}') {
		pageCont = ejs.render(pageCont, ejsParams);
	}
	res.end(pageCont);
}

//protocol check
function checkProtocol(req, res, hostInfo, path) {
	var protocol = req.headers['fly-forwarded-proto'];
	if (protocol == 'http') {
		res.statusCode = 301;
		res.setHeader('Location', 'https://' + hostInfo + path);
		res.end();
	}
}

// POST Request Function
function post(req, res, callback) {
	var body = '';
	req.on('data', function(data) {
		body += data;
		if (body.length > 1e6) {
			body = '';
			res.writeHead(413, { 'Content-Type': 'text/plain' }).end();
			req.connection.destroy();
		}
	});
	req.on('end', function() {
		callback(body);
	});
}

function updateCount(value) {
	console.log(value);
	const https = require('https');

	https
		.get(`https://www.bppimtinventory.tk/admin/count?pc=${value}`, resp => {
			let data = '';
			resp.on('data', chunk => {
				data += chunk;
			});
			resp.on('end', () => {
				console.log(data);
			});
		})
		.on('error', err => {
			console.log('Error: ' + err.message);
		});
}

function email_reset_send(email, sub, body_html) {
	const mailjet = require('node-mailjet').connect(
		process.env.MJ_APIKEY_PUBLIC,
		process.env.MJ_APIKEY_PRIVATE
	);
	const request = mailjet.post('send', { version: 'v3.1' }).request({
		Messages: [
			{
				From: {
					Email: 'abirghoshmarch1999@gmail.com',
					Name: 'Inventory System <admin@inventorysystem.tk>'
				},
				To: [
					{
						Email: `${email}`,
						Name: 'Employee'
					}
				],
				Subject: `${sub}`,
				TextPart: `${sub}`,
				HTMLPart: `${body_html}`
			}
		]
	});
	request
		.then(result => {
			console.log(result.body);
		})
		.catch(err => {
			console.log(err.statusCode);
		});
}
