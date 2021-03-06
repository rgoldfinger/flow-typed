// @flow

import Sequelize, {Model, Transaction} from "sequelize";
import type {fn} from 'sequelize'
import type { DefineAttributes } from "sequelize";
import type {
  HasOneGetOne,
  HasOneSetOne,
  HasOneCreateOne,
  HasManyCreateOne,
  HasManyRemoveOne,
  BelongsToGetOne,
  BelongsToSetOne,
  BelongsToCreateOne,
  BelongsToManyCreateOne,
  HasManyGetMany,
  HasManySetMany,
  HasManyAddMany,
  HasManyAddOne,
  HasManyRemoveMany,
  HasManyHasOne,
  HasManyHasMany,
  HasManyCount,
  BelongsToManyGetMany,
  BelongsToManySetMany,
  BelongsToManyAddMany,
  BelongsToManyAddOne,
  BelongsToManyRemoveOne,
  BelongsToManyRemoveMany,
  BelongsToManyHasOne,
  BelongsToManyHasMany,
  BelongsToManyCount,
  Association,
  DataTypeAbstract,
} from "sequelize";

//
//  Fixtures
// ~~~~~~~~~~
//

type AnyAttributes = Object;

let s         = new Sequelize( '' );
let sequelize = s;
let DataTypes = Sequelize;
let User: Class<Model<AnyAttributes>>      = s.define( 'user', {} );
let user      = User.build();
let Task: Class<Model<AnyAttributes>>      = s.define( 'task', {} );
let Group: Class<Model<AnyAttributes>>     = s.define( 'group', {} );
let Comment: Class<Model<AnyAttributes>>   = s.define( 'comment', {} );
let Post: Class<Model<AnyAttributes>>      = s.define( 'post', {} );
let t: Transaction = (null: any);
s.transaction().then( ( a ) => t = a );

//
//  Generics
// ~~~~~~~~~~
//

interface GUserAttributes {
  id? : number;
  username? : string;
}

declare class GUserModel extends Model<GUserAttributes> {}
let GUser: typeof GUserModel = s.define( 'user', { id: Sequelize.INTEGER, username : Sequelize.STRING });
GUser.create({ id : 1, username : 'one' }).then( ( guser ) => guser.save() );

let schema : DefineAttributes = {
  key : { type : Sequelize.STRING, primaryKey : true },
  value : Sequelize.STRING
};

s.define('user', schema);

interface GTaskAttributes {
  revision? : number;
  name? : string;
}
declare class GTaskModel extends Model<GTaskAttributes> {
  upRevision(): void;
}
let GTask: typeof GTaskModel = s.define( 'task', { revision : Sequelize.INTEGER, name : Sequelize.STRING });

GUser.hasMany(GTask);

GTask.create({ revision: 1, name: 'test' }).then( (gtask) => gtask.upRevision() );

//
//  Model.Options
// ~~~~~~~~~~~~~~~
//

(GUser.options.name.singular: string);
(GUser.options.name.plural: string);
(GUser.options.timestamps: ?boolean);
(GUser.options.paranoid: ?boolean);
(GUser.options.underscored: ?boolean);
(GUser.options.underscoredAll: ?boolean);
(GUser.options.hasTrigger: ?boolean);
(GUser.options.freezeTableName: ?boolean);

//
//  Associations
// ~~~~~~~~~~~~~~
//
//  https://github.com/sequelize/sequelize/tree/v3.4.1/test/integration/associations
//

User.hasOne( Task );
User.hasOne( Task, { foreignKey : 'primaryGroupId', as : 'primaryUsers' } );
User.hasOne( Task, { foreignKey : 'userCoolIdTag' } );
User.hasOne( Task, { foreignKey : 'userId', keyType : Sequelize.STRING, constraints : false } );
Task.hasOne( User, { foreignKey : { name : 'taskId', field : 'task_id' } } );
User.hasOne( Task, { foreignKey : { name : 'uid', allowNull : false } } );
User.hasOne( Task, { onDelete : 'cascade' } );
User.hasOne( Task, { onUpdate : 'cascade' } );
User.hasOne( Task, { onDelete : 'cascade', hooks : true } );
User.hasOne( Task, { foreignKey : { allowNull : false } } );
User.hasOne( Task, { foreignKeyConstraint : true } );

User.belongsTo( Task );
User.belongsTo( Task, { foreignKey : 'primaryGroupId', as : 'primaryUsers' } );
Task.belongsTo( User, { foreignKey : 'user_id' } );
Task.belongsTo( User, { foreignKey : 'user_name', targetKey : 'username' } );
User.belongsTo( User, { foreignKey : 'userId', keyType : Sequelize.STRING, constraints : false } );
User.belongsTo( Post, { foreignKey : { name : 'AccountId', field : 'account_id' } } );
Task.belongsTo( User, { foreignKey : { allowNull : false, name : 'uid' } } );
Task.belongsTo( User, { constraints : false } );
Task.belongsTo( User, { onDelete : 'cascade' } );
Task.belongsTo( User, { onUpdate : 'restrict' } );
User.belongsTo( User, {
  as : 'parentBlocks',
  foreignKey : 'child',
  foreignKeyConstraint : true
} );

User.hasMany( User );
User.hasMany( User, { foreignKey : 'primaryGroupId', as : 'primaryUsers' } );
User.hasMany( Task, { foreignKey : 'userId' } );
User.hasMany( Task, { foreignKey : 'userId', as : 'activeTasks', scope : { active : true } } );
User.hasMany( Task, { foreignKey : 'userId', keyType : Sequelize.STRING, constraints : false } );
User.hasMany( Task, { foreignKey : { name : 'uid', allowNull : false } } );
User.hasMany( Task, { foreignKey : { allowNull : true } } );
User.hasMany( Task, { as : 'Children' } );
User.hasMany( Task, { as : { singular : 'task', plural : 'taskz' } } );
User.hasMany( Task, { constraints : false } );
User.hasMany( Task, { onDelete : 'cascade' } );
User.hasMany( Task, { onUpdate : 'cascade' } );
Post.hasMany( Task, { foreignKey : 'commentable_id', scope : { commentable : 'post' } } );
User.hasMany( User, {
  as : 'childBlocks',
  foreignKey : 'parent',
  foreignKeyConstraint : true
} );

User.belongsToMany( Task, { through : 'UserTasks' } );
User.belongsToMany( User, { through : Task } );
User.belongsToMany( Group, { as : 'groups', through : Task, foreignKey : 'id_user' } );
User.belongsToMany( Task, { as : 'activeTasks', through : Task, scope : { active : true } } );
User.belongsToMany( Task, { as : 'startedTasks', through : { model : Task, scope : { started : true } } } );
User.belongsToMany( Group, { through : 'group_members', foreignKey : 'group_id', otherKey : 'member_id' } );
User.belongsToMany( User, { as : 'Participants', through : User } );
User.belongsToMany( Group, { through : 'user_places', foreignKey : 'user_id' } );
User.belongsToMany( Group, {
  through : 'user_projects',
  as : 'Projects',
  foreignKey : {
    field : 'user_id',
    name : 'userId'
  },
  otherKey : {
    field : 'project_id',
    name : 'projectId'
  }
} );
User.belongsToMany( Task, { onDelete : 'RESTRICT', through : 'tasksusers' } );
User.belongsToMany( Task, { constraints : false, through : 'tasksusers' } );
User.belongsToMany( Task, { foreignKey : { name : 'user_id', defaultValue : 42 }, through : 'UserProjects' } );
User.belongsToMany( Post, { through : User } );
Post.belongsToMany( User, { as : 'categories', through : User, scope : { type : 'category' } } );
Post.belongsToMany( User, { as : 'tags', through : User, scope : { type : 'tag' } } );
Post.belongsToMany( User, {
  through : {
    model : User,
    unique : false,
    scope : {
      taggable : 'post'
    }
  },
  foreignKey : 'taggable_id',
  constraints : false
} );
Post.belongsToMany( Post, { through : { model : Post, unique : false }, foreignKey : 'tag_id' } );
Post.belongsToMany( Post, { as : 'Parents', through : 'Family', foreignKey : 'ChildId', otherKey : 'PersonId' } );

//
// Mixins
// ~~~~~~
//
//  https://github.com/sequelize/sequelize/tree/v3.4.1/test/integration/associations
//

let Product: typeof ProductInstance = s.define('product', {});
let product = Product.build();

let Barcode: typeof BarcodeInstance = s.define('barcode', {});
let barcode = Barcode.build();

let Warehouse: typeof WarehouseInstance = s.define('warehouse', {});
let warehouse = Warehouse.build();

let Branch: typeof BranchInstance = s.define('branch', {});
let branch = Branch.build();

let WarehouseBranch: typeof WarehouseBranchInstance = s.define('warehouseBranch', {});

let Customer: typeof CustomerInstance = s.define('customer', {});
let customer = Customer.build();

const ProductBarcode = Product.hasOne(Barcode);
const BarcodeProduct = Barcode.belongsTo(Product);

const WarehouseProducts = Warehouse.hasMany(Product);
const ProductWarehouse = Product.belongsTo(Warehouse);

const WarehouseBranches = Warehouse.belongsToMany(Branch, { through: WarehouseBranch });
const BranchWarehouses = Branch.belongsToMany(Warehouse, { through: WarehouseBranch });

Branch.belongsToMany(Customer, { through: 'branchCustomer' });
Customer.belongsToMany(Branch, { through: 'branchCustomer' });

// Metadata

(Warehouse.associations.branch: Association<WarehouseInstance, BranchInstance>);
(Warehouse.tableName: string);
(Warehouse.rawAttributes.blah.type: DataTypeAbstract);
(Warehouse.tableAttributes.blah.type: DataTypeAbstract);
(Warehouse.attributes.blah.type: DataTypeAbstract);
(Warehouse.primaryKeys.blah.type: DataTypeAbstract);

Warehouse.getAssociations(WarehouseBranch)
Warehouse.getAssociationForAlias(WarehouseBranch, 'blah')

// hasOne
product.getBarcode();
product.getBarcode({ scope: null }).then(b => b && b.code);

product.setBarcode(null);
product.setBarcode(1);
product.setBarcode(barcode);
product.setBarcode(barcode, { save: true }).then(() => { });

product.createBarcode();
product.createBarcode({ id: 1, code: '1434-2' });
product.createBarcode({ id: 1 }, { save: true, silent: true }).then(() => { });

// belongsTo
barcode.getProduct();
barcode.getProduct({ scope: 'foo' }).then(p => p && p.name);

barcode.setProduct(null);
barcode.setProduct(1);
barcode.setProduct(product);
barcode.setProduct(product, { save: true }).then(() => { });

barcode.createProduct({ id: 1, name: 'Crowbar' });
barcode.createProduct({ id: 1 }, { save: true, silent: true }).then((product) => { });

product.getWarehouse();
product.getWarehouse({ scope: null }).then(w => w && w.capacity);

product.setWarehouse(null);
product.setWarehouse(1);
product.setWarehouse(warehouse);
product.setWarehouse(warehouse, { save: true }).then(() => { });

product.createWarehouse();
product.createWarehouse({ id: 1, capacity: 10000 });
product.createWarehouse({ id: 1 }, { save: true, silent: true }).then(() => { });

// hasMany
warehouse.getProducts();
warehouse.getProducts({ where: {}, scope: false });
warehouse.getProducts({ where: {}, scope: false }).then((products) => products[0].id);

warehouse.setProducts(null);
warehouse.setProducts([product]);
warehouse.setProducts([product], { validate: true }).then(() => { });

warehouse.addProducts([product]);
warehouse.addProducts([product, 2], { validate: false }).then(() => { });

warehouse.addProduct(product);
warehouse.addProduct(2, { validate: true }).then(() => { });

warehouse.createProduct({ id: 1, name: 'baz' });
warehouse.createProduct({ id: 1 }, { silent: true }).then((product) => { });

warehouse.removeProducts();
warehouse.removeProducts([product]);
warehouse.removeProducts([product, 2], { validate: false }).then(() => { });

warehouse.removeProduct(product);
warehouse.removeProduct(2, { validate: true }).then(() => { });

warehouse.hasProducts([product]);
warehouse.hasProducts([product, 2], { scope: 'bar' }).then((result: boolean) => { });

warehouse.hasProduct(product);
warehouse.hasProduct(2, { scope: 'baz' }).then((result: boolean) => { });

warehouse.countProducts();
warehouse.countProducts({ scope: 'baz' }).then((result: number) => { });

// belongsToMany <Model>
warehouse.getBranches();
warehouse.getBranches({ where: {} });
warehouse.getBranches({ where: {} }).then((branches) => branches[0].rank);

warehouse.setBranches(null);
warehouse.setBranches([branch]);
warehouse.setBranches([branch, 2], { validate: true, through: { distance: 1 } }).then(() => { });

warehouse.addBranches([branch]);
warehouse.addBranches([branch, 2], { validate: false, through: { distance: 1 } }).then(() => { });

warehouse.addBranch(branch);
warehouse.addBranch(2, { validate: true, through: { distance: 1 } }).then(() => { });

warehouse.createBranch();
warehouse.createBranch({ id: 1, address: 'baz' });
warehouse.createBranch({ id: 1 }, { silent: true, through: { distance: 1 } }).then((branch) => { });

warehouse.removeBranches();
warehouse.removeBranches([branch]);
warehouse.removeBranches([branch, 2], { validate: false }).then(() => { });

warehouse.removeBranch(branch);
warehouse.removeBranch(2, { validate: true }).then(() => { });

warehouse.hasBranches([branch]);
warehouse.hasBranches([branch, 2], { scope: 'bar' }).then((result: boolean) => { });

warehouse.hasBranch(branch);
warehouse.hasBranch(2, { scope: 'baz' }).then((result: boolean) => { });

warehouse.countBranches();
warehouse.countBranches({ scope: 'baz' }).then((result: number) => { });

// belongsToMany <void>
customer.getBranches();
customer.getBranches({ where: {} });
customer.getBranches({ where: {} }).then((branches) => branches[0].rank);

customer.setBranches(null);
customer.setBranches([branch]);
customer.setBranches([branch, 2], { validate: true }).then(() => { });

customer.addBranches([branch]);
customer.addBranches([branch, 2], { validate: false }).then(() => { });

customer.addBranch(branch);
customer.addBranch(2, { validate: true }).then(() => { });

customer.createBranch();
customer.createBranch({ id: 1, address: 'baz' });
customer.createBranch({ id: 1 }, { silent: true }).then((branch) => { });

customer.removeBranches();
customer.removeBranches([branch]);
customer.removeBranches([branch, 2], { validate: false }).then(() => { });

customer.removeBranch(branch);
customer.removeBranch(2, { validate: true }).then(() => { });

customer.hasBranches([branch]);
customer.hasBranches([branch, 2], { scope: 'bar' }).then((result: boolean) => { });

customer.hasBranch(branch);
customer.hasBranch(2, { scope: 'baz' }).then((result: boolean) => { });

customer.countBranches();
customer.countBranches({ scope: 'baz' }).then((result: number) => { });

// query on associations

WarehouseProducts.get(warehouse).then((products: Array<ProductInstance>) => {})
WarehouseProducts.get([warehouse], {scope: 'baz'}).then((products: {[id: number]: ProductInstance}) => {})
WarehouseProducts.count(warehouse).then((count: number) => {})
WarehouseProducts.count(warehouse, {scope: 'baz'}).then((count: number) => {})
WarehouseProducts.has(warehouse, [product, 2]).then((result: boolean) => {})
WarehouseProducts.has(warehouse, [product, 2], {scope: 'baz'}).then((result: boolean) => {})
WarehouseProducts.set(warehouse, [product, 2]).then((result: WarehouseInstance) => {})
WarehouseProducts.set(warehouse, [product, 2], {where: {}, scope: 'baz'}).then((result: WarehouseInstance) => {})
WarehouseProducts.remove(warehouse, [product, 2]).then((result: typeof WarehouseProducts) => {})
WarehouseProducts.remove(warehouse, [product, 2], {where: {}, individualHooks: true}).then((result: typeof WarehouseProducts) => {})
WarehouseProducts.create(warehouse, {
  name: 'doodad',
  price: 2.50,
}, {individualHooks: true}).then((result: ProductInstance) => {})

WarehouseBranches.get(warehouse).then((branches: Array<BranchInstance>) => {})
WarehouseBranches.get(warehouse, {scope: 'baz'}).then((branches: Array<BranchInstance>) => {})
WarehouseBranches.count(warehouse).then((count: number) => {})
WarehouseBranches.count(warehouse, {scope: 'baz'}).then((count: number) => {})
WarehouseBranches.has(warehouse, [branch, 2]).then((result: boolean) => {})
WarehouseBranches.has(warehouse, [branch, 2], {scope: 'blah'}).then((result: boolean) => {})
WarehouseBranches.set(warehouse, [branch, 2]).then((result: any) => {})
WarehouseBranches.set(warehouse, [branch, 2], {scope: 'blah'}).then((result: any) => {})
WarehouseBranches.remove(warehouse, [branch, 2]).then(() => {})
WarehouseBranches.remove(warehouse, [branch, 2], {scope: 'blah'}).then(() => {})
WarehouseBranches.create(warehouse, {
  address: 'somewhere',
  rank: 12,
}, {
  through: {
    distance: 4.5,
  },
  individualHooks: true,
}).then((result: Branch) => {})

ProductBarcode.get(product).then((barcode: BarcodeInstance) => {})
ProductBarcode.get(product).then((barcode: BarcodeInstance) => {})
ProductBarcode.get([product]).then((barcodes: {[id: number]: BarcodeInstance}) => {})
ProductBarcode.get([product], {scope: 'boo'})
ProductBarcode.set(product, barcode)
ProductBarcode.set(product, 1, {scope: 'bar'})
ProductBarcode.create(product, {
  code: 'blah',
  dateIssued: new Date(),
}).then((barcode: BarcodeInstance) => {})
ProductBarcode.create(product, {
  code: 'blah',
  dateIssued: new Date(),
}, {
  save: true,
})

ProductWarehouse.get(product).then((warehouse: WarehouseInstance) => {})
ProductWarehouse.get([product]).then((warehouses: {[id: number]: WarehouseInstance}) => {})
ProductWarehouse.get([product], {scope: 'boo'})
ProductWarehouse.set(product, warehouse)
ProductWarehouse.set(product, 1, {scope: 'bar'})
ProductWarehouse.create(product, {
  address: 'somewhere',
  capacity: 10000,
}).then((warehouse: WarehouseInstance) => {})
ProductWarehouse.create(product, {
  address: 'somewhere',
  capacity: 10000,
}, {
  save: true,
})

// query with associations

Warehouse.findAll({include: [{association: WarehouseProducts}]}).then((warehouses: Array<WarehouseInstance>) => {})
Warehouse.findAll({include: [{association: WarehouseBranches}]}).then((warehouses: Array<WarehouseInstance>) => {})
Branch.findAll({include: [{association: BranchWarehouses}]}).then((branch: Array<BranchInstance>) => {})
Product.findOne({include: [{association: ProductWarehouse}]}).then((product: ?Product) => {})

type ProductAttributes = {
  id?: number;
  name?: string;
  price?: number;
};

declare class ProductInstance extends Model<ProductAttributes> {
  id?: number;
  name?: string;
  price?: number;

  // hasOne association mixins:
  getBarcode: HasOneGetOne<BarcodeInstance>;
  setBarcode: HasOneSetOne<BarcodeInstance, number>;
  createBarcode: HasOneCreateOne<BarcodeAttributes>;

  // belongsTo association mixins:
  getWarehouse: BelongsToGetOne<WarehouseInstance>;
  setWarehouse: BelongsToSetOne<WarehouseInstance, number>;
  createWarehouse: BelongsToCreateOne<WarehouseAttributes>;
};

type BarcodeAttributes = {
  id?: number;
  code?: string;
  dateIssued?: Date;
};

declare class BarcodeInstance extends Model<BarcodeAttributes> {
  id?: number;
  code?: string;
  dateIssued?: Date;
  // belongsTo association mixins:
  getProduct: BelongsToGetOne<ProductInstance>;
  setProduct: BelongsToSetOne<ProductInstance, number>;
  createProduct: BelongsToCreateOne<ProductAttributes>;
};

type WarehouseAttributes = {
  id?: number;
  address?: string;
  capacity?: number;
};

declare class WarehouseInstance extends Model<WarehouseAttributes> {
  id?: number;
  address?: string;
  capacity?: number;
  // hasMany association mixins:
  getProducts: HasManyGetMany<ProductInstance>;
  setProducts: HasManySetMany<ProductInstance, number>;
  addProducts: HasManyAddMany<ProductInstance, number>;
  addProduct: HasManyAddOne<ProductInstance, number>;
  createProduct: HasManyCreateOne<ProductAttributes, ProductInstance>;
  removeProduct: HasManyRemoveOne<ProductInstance, number>;
  removeProducts: HasManyRemoveMany<ProductInstance, number>;
  hasProduct: HasManyHasOne<ProductInstance, number>;
  hasProducts: HasManyHasMany<ProductInstance, number>;
  countProducts: HasManyCount;

  // belongsToMany association mixins:
  getBranches: BelongsToManyGetMany<BranchInstance>;
  setBranches: BelongsToManySetMany<BranchInstance, number, WarehouseBranchAttributes>;
  addBranches: BelongsToManyAddMany<BranchInstance, number, WarehouseBranchAttributes>;
  addBranch: BelongsToManyAddOne<BranchInstance, number, WarehouseBranchAttributes>;
  createBranch: BelongsToManyCreateOne<BranchAttributes, BranchInstance, WarehouseBranchAttributes>;
  removeBranch: BelongsToManyRemoveOne<BranchInstance, number>;
  removeBranches: BelongsToManyRemoveMany<BranchInstance, number>;
  hasBranch: BelongsToManyHasOne<BranchInstance, number>;
  hasBranches: BelongsToManyHasMany<BranchInstance, number>;
  countBranches: BelongsToManyCount;
};

type BranchAttributes = {
  id?: number;
  address?: string;
  rank?: number;
};

declare class BranchInstance extends Model<BranchAttributes> {
  id?: number;
  address?: string;
  rank?: number;

  // belongsToMany association mixins:
  getWarehouses: BelongsToManyGetMany<WarehouseInstance>;
  setWarehouses: BelongsToManySetMany<WarehouseInstance, number, WarehouseBranchAttributes>;
  addWarehouses: BelongsToManyAddMany<WarehouseInstance, number, WarehouseBranchAttributes>;
  addWarehouse: BelongsToManyAddOne<WarehouseInstance, number, WarehouseBranchAttributes>;
  createWarehouse: BelongsToManyCreateOne<WarehouseAttributes, WarehouseInstance, WarehouseBranchAttributes>;
  removeWarehouse: BelongsToManyRemoveOne<WarehouseInstance, number>;
  removeWarehouses: BelongsToManyRemoveMany<WarehouseInstance, number>;
  hasWarehouse: BelongsToManyHasOne<WarehouseInstance, number>;
  hasWarehouses: BelongsToManyHasMany<WarehouseInstance, number>;
  countWarehouses: BelongsToManyCount;

  // belongsToMany association mixins:
  getCustomers: BelongsToManyGetMany<CustomerInstance>;
  setCustomers: BelongsToManySetMany<CustomerInstance, number, void>;
  addCustomers: BelongsToManyAddMany<CustomerInstance, number, void>;
  addCustomer: BelongsToManyAddOne<CustomerInstance, number, void>;
  createCustomer: BelongsToManyCreateOne<CustomerAttributes, CustomerInstance, void>;
  removeCustomer: BelongsToManyRemoveOne<CustomerInstance, number>;
  removeCustomers: BelongsToManyRemoveMany<CustomerInstance, number>;
  hasCustomer: BelongsToManyHasOne<CustomerInstance, number>;
  hasCustomers: BelongsToManyHasMany<CustomerInstance, number>;
  countCustomers: BelongsToManyCount;
};

type WarehouseBranchAttributes = {
  distance?: number;
};

declare class WarehouseBranchInstance extends Model<WarehouseBranchAttributes> {
  distance?: number;
};

type CustomerAttributes = {
  id?: number;
  fullname?: string;
  credit?: number;
};

declare class CustomerInstance extends Model<CustomerAttributes> {
  id?: number;
  fullname?: string;
  credit?: number;
  // belongsToMany association mixins:
  getBranches: BelongsToManyGetMany<BranchInstance>;
  setBranches: BelongsToManySetMany<BranchInstance, number, void>;
  addBranches: BelongsToManyAddMany<BranchInstance, number, void>;
  addBranch: BelongsToManyAddOne<BranchInstance, number, void>;
  createBranch: BelongsToManyCreateOne<BranchAttributes, BranchInstance, void>;
  removeBranch: BelongsToManyRemoveOne<BranchInstance, number>;
  removeBranches: BelongsToManyRemoveMany<BranchInstance, number>;
  hasBranch: BelongsToManyHasOne<BranchInstance, number>;
  hasBranches: BelongsToManyHasMany<BranchInstance, number>;
  countBranches: BelongsToManyCount;
};

//
//  DataTypes
// ~~~~~~~~~~~
//
//  https://github.com/sequelize/sequelize/blob/v3.4.1/test/unit/sql/data-types.test.js
//

Sequelize.STRING;
Sequelize.STRING( 1234 );
Sequelize.STRING( { length : 1234 } );
Sequelize.STRING( 1234 ).BINARY;
Sequelize.STRING.BINARY;
Sequelize.TEXT;
Sequelize.TEXT( 'tiny' );
Sequelize.TEXT( { length : 'tiny' } );
Sequelize.TEXT( 'medium' );
Sequelize.TEXT( 'long' );
Sequelize.CHAR;
Sequelize.CHAR( 12 );
Sequelize.CHAR( { length : 12 } );
Sequelize.CHAR( 12 ).BINARY;
Sequelize.CHAR.BINARY;
Sequelize.BOOLEAN;
Sequelize.DATE;
Sequelize.DATE(6);
Sequelize.UUID;
Sequelize.UUIDV1;
Sequelize.UUIDV4;
Sequelize.NOW;
Sequelize.INTEGER;
Sequelize.INTEGER.UNSIGNED;
Sequelize.INTEGER.UNSIGNED.ZEROFILL;
Sequelize.INTEGER( 11 );
Sequelize.INTEGER( { length : 11 } );
Sequelize.INTEGER( 11 ).UNSIGNED;
Sequelize.INTEGER( 11 ).UNSIGNED.ZEROFILL;
Sequelize.INTEGER( 11 ).ZEROFILL;
Sequelize.INTEGER( 11 ).ZEROFILL.UNSIGNED;
Sequelize.BIGINT;
Sequelize.BIGINT.UNSIGNED;
Sequelize.BIGINT.UNSIGNED.ZEROFILL;
Sequelize.BIGINT( 11 );
Sequelize.BIGINT( { length : 11 } );
Sequelize.BIGINT( 11 ).UNSIGNED;
Sequelize.BIGINT( 11 ).UNSIGNED.ZEROFILL;
Sequelize.BIGINT( 11 ).ZEROFILL;
Sequelize.BIGINT( 11 ).ZEROFILL.UNSIGNED;
Sequelize.REAL.UNSIGNED;
Sequelize.REAL( 11 );
Sequelize.REAL( { length : 11 } );
Sequelize.REAL( 11 ).UNSIGNED;
Sequelize.REAL( 11 ).UNSIGNED.ZEROFILL;
Sequelize.REAL( 11 ).ZEROFILL;
Sequelize.REAL( 11 ).ZEROFILL.UNSIGNED;
Sequelize.REAL( 11, 12 );
Sequelize.REAL( 11, 12 ).UNSIGNED;
Sequelize.REAL( { length : 11, decimals : 12 } ).UNSIGNED;
Sequelize.REAL( 11, 12 ).UNSIGNED.ZEROFILL;
Sequelize.REAL( 11, 12 ).ZEROFILL;
Sequelize.REAL( 11, 12 ).ZEROFILL.UNSIGNED;
Sequelize.DOUBLE;
Sequelize.DOUBLE.UNSIGNED;
Sequelize.DOUBLE( 11 );
Sequelize.DOUBLE( 11 ).UNSIGNED;
Sequelize.DOUBLE( { length : 11 } ).UNSIGNED;
Sequelize.DOUBLE( 11 ).UNSIGNED.ZEROFILL;
Sequelize.DOUBLE( 11 ).ZEROFILL;
Sequelize.DOUBLE( 11 ).ZEROFILL.UNSIGNED;
Sequelize.DOUBLE( 11, 12 );
Sequelize.DOUBLE( 11, 12 ).UNSIGNED;
Sequelize.DOUBLE( 11, 12 ).UNSIGNED.ZEROFILL;
Sequelize.DOUBLE( 11, 12 ).ZEROFILL;
Sequelize.DOUBLE( 11, 12 ).ZEROFILL.UNSIGNED;
Sequelize.FLOAT;
Sequelize.FLOAT.UNSIGNED;
Sequelize.FLOAT( 11 );
Sequelize.FLOAT( 11 ).UNSIGNED;
Sequelize.FLOAT( 11 ).UNSIGNED.ZEROFILL;
Sequelize.FLOAT( 11 ).ZEROFILL;
Sequelize.FLOAT( { length : 11 } ).ZEROFILL;
Sequelize.FLOAT( 11 ).ZEROFILL.UNSIGNED;
Sequelize.FLOAT( 11, 12 );
Sequelize.FLOAT( 11, 12 ).UNSIGNED;
Sequelize.FLOAT( { length : 11, decimals : 12 } ).UNSIGNED;
Sequelize.FLOAT( 11, 12 ).UNSIGNED.ZEROFILL;
Sequelize.FLOAT( 11, 12 ).ZEROFILL;
Sequelize.FLOAT( 11, 12 ).ZEROFILL.UNSIGNED;
Sequelize.NUMERIC;
Sequelize.NUMERIC( 15, 5 );
Sequelize.DECIMAL;
Sequelize.DECIMAL( 10, 2 );
Sequelize.DECIMAL( { precision : 10, scale : 2 } );
Sequelize.DECIMAL( 10 );
Sequelize.DECIMAL( { precision : 10 } );
Sequelize.ENUM( 'value 1', 'value 2' );
Sequelize.BLOB;
Sequelize.BLOB( 'tiny' );
Sequelize.BLOB( 'medium' );
Sequelize.BLOB( { length : 'medium' } );
Sequelize.BLOB( 'long' );
Sequelize.ARRAY( Sequelize.STRING );
Sequelize.ARRAY( Sequelize.STRING( 100 ) );
Sequelize.ARRAY( Sequelize.INTEGER );
Sequelize.ARRAY( Sequelize.HSTORE );
Sequelize.ARRAY( Sequelize.ARRAY( Sequelize.STRING ) );
Sequelize.ARRAY( Sequelize.TEXT );
Sequelize.ARRAY( Sequelize.DATE );
Sequelize.ARRAY( Sequelize.BOOLEAN );
Sequelize.ARRAY( Sequelize.DECIMAL );
Sequelize.ARRAY( Sequelize.DECIMAL( 6 ) );
Sequelize.ARRAY( Sequelize.DECIMAL( 6, 4 ) );
Sequelize.ARRAY( Sequelize.DOUBLE );
Sequelize.ARRAY( Sequelize.REAL );
Sequelize.ARRAY( Sequelize.JSON );
Sequelize.ARRAY( Sequelize.JSONB );
Sequelize.GEOMETRY;
Sequelize.GEOMETRY( 'POINT' );
Sequelize.GEOMETRY( 'LINESTRING' );
Sequelize.GEOMETRY( 'POLYGON' );
Sequelize.GEOMETRY( 'POINT', 4326 );
Sequelize.VIRTUAL;
Sequelize.VIRTUAL( Sequelize.STRING );
Sequelize.VIRTUAL( Sequelize.DATE , ['property1', 'property2']);
new Sequelize.VIRTUAL( Sequelize.STRING );
new Sequelize.VIRTUAL( Sequelize.DATE , ['property1', 'property2']);

//
//  Deferrable
// ~~~~~~~~~~~~
//
//  https://github.com/sequelize/sequelize/blob/v3.4.1/test/integration/sequelize/deferrable.test.js
//

Sequelize.Deferrable.NOT;
Sequelize.Deferrable.INITIALLY_IMMEDIATE;
Sequelize.Deferrable.INITIALLY_DEFERRED;
Sequelize.Deferrable.SET_DEFERRED;
Sequelize.Deferrable.SET_DEFERRED( ['taskTableName_user_id_fkey'] );
Sequelize.Deferrable.SET_IMMEDIATE;
Sequelize.Deferrable.SET_IMMEDIATE( ['taskTableName_user_id_fkey'] );

//
//  Errors
// ~~~~~~~~
//
//  https://github.com/sequelize/sequelize/blob/v3.4.1/test/integration/error.test.js
//

Sequelize.Error;
Sequelize.ValidationError;
s.Error;
s.ValidationError;
new s.ValidationError( 'Validation Error', [
  new s.ValidationErrorItem( '<field name> cannot be null', 'notNull Violation', '<field name>', 'value' )
  , new s.ValidationErrorItem( '<field name> cannot be an array or an object', 'string violation',
    '<field name>', 'value' )
] );
new s.Error();
new s.ValidationError('message');
new s.ValidationErrorItem( 'invalid', 'type', 'first_name', 'value' );
new s.ValidationErrorItem( 'invalid', 'type', 'last_name', 'value' );
new s.DatabaseError( new Error( 'original database error message' ) );
new s.ConnectionError( new Error( 'original connection error message' ) );
new s.ConnectionRefusedError( new Error( 'original connection error message' ) );
new s.AccessDeniedError( new Error( 'original connection error message' ) );
new s.HostNotFoundError( new Error( 'original connection error message' ) );
new s.HostNotReachableError( new Error( 'original connection error message' ) );
new s.InvalidConnectionError( new Error( 'original connection error message' ) );
new s.ConnectionTimedOutError( new Error( 'original connection error message' ) );
new s.EmptyResultError();

const uniqueConstraintError: Sequelize.ValidationError = new s.UniqueConstraintError({});

//
//  Hooks
// ~~~~~~~
//
//  https://github.com/sequelize/sequelize/blob/v3.4.1/test/integration/hooks.test.js
//

User.addHook( 'afterCreate', function( instance : Model<any>, options : Object, next : Function ) { next(); } );
User.addHook( 'afterCreate', 'myHook', function( instance : Model<any>, options : Object, next : Function) { next(); } );
s.addHook( 'beforeInit', function( config : Object, options : Object ) { } );
User.hook( 'afterCreate', 'myHook', function( instance : Model<any>, options : Object, next : Function) { next(); } );
User.hook( 'afterCreate', 'myHook', function( instance : Model<any>, options : Object, next : Function ) { next(); } );

User.removeHook( 'afterCreate', 'myHook' );

User.hasHook( 'afterCreate' );
User.hasHooks( 'afterCreate' );

User.beforeValidate( function( user, options ) { user.isNewRecord; } );
User.beforeValidate( 'myHook', function( user, options ) { user.isNewRecord; } );

User.afterValidate( function( user, options ) { user.isNewRecord; } );
User.afterValidate( 'myHook', function( user, options ) { user.isNewRecord; } );

User.beforeCreate( function( user, options ) { user.isNewRecord; } );
User.beforeCreate( function( user, options, fn ) {fn();} );
User.beforeCreate( 'myHook', function( user, options ) { user.isNewRecord; } );

User.afterCreate( function( user, options ) { user.isNewRecord; } );
User.afterCreate( function( user, options, fn ) {fn();} );
User.afterCreate( 'myHook', function( user, options ) { user.isNewRecord; } );

User.beforeDestroy( function( user, options ) {throw new Error( 'Whoops!' );} );
User.beforeDestroy( function( user, options, fn ) {fn();} );
User.beforeDestroy( 'myHook', function( user, options ) {throw new Error( 'Whoops!' );} );
User.beforeDelete( function( user, options ) {throw new Error( 'Whoops!' );} );
User.beforeDelete( 'myHook', function( user, options ) {throw new Error( 'Whoops!' );} );

User.afterDestroy( function( user, options ) {throw new Error( 'Whoops!' );} );
User.afterDestroy( 'myHook', function( user, options ) {throw new Error( 'Whoops!' );} );
User.afterDestroy( function( user, options, fn ) {fn();} );
User.afterDelete( function( user, options ) {throw new Error( 'Whoops!' );} );
User.afterDelete( 'myHook', function( user, options ) {throw new Error( 'Whoops!' );} );

User.beforeUpdate( function( user, options ) {throw new Error( 'Whoops!' ); } );
User.beforeUpdate( 'myHook', function( user, options ) {throw new Error( 'Whoops!' ); } );

User.afterUpdate( function( user, options ) {throw new Error( 'Whoops!' );} );
User.afterUpdate( 'myHook', function( user, options ) {throw new Error( 'Whoops!' );} );

User.beforeUpsert( function( user, options ) { throw new Error('Whoops'); } );
User.beforeUpsert( 'myHook', function( user, options ) { throw new Error('Whoops'); } );

User.afterUpsert( function( result, options ) { throw new Error('Whoops'); } );
User.afterUpsert( 'myHook', function( result, options ) { throw new Error('Whoops'); } );

User.beforeBulkCreate( function( daos, options ) { throw new Error( 'Whoops!' );} );
User.beforeBulkCreate( 'myHook', function( daos, options ) { throw new Error( 'Whoops!' );} );
User.beforeBulkCreate( function( daos, options, fn ) {fn();} );

User.afterBulkCreate( function( daos, options ) {throw new Error( 'Whoops!' ); } );
User.afterBulkCreate( 'myHook', function( daos, options ) {throw new Error( 'Whoops!' ); } );
User.afterBulkCreate( function( daos, options, fn ) {fn();} );

User.beforeBulkDestroy( function( options ) {throw new Error( 'Whoops!' );} );
User.beforeBulkDestroy( function( options, fn ) {fn();} );
User.beforeBulkDestroy( 'myHook', function( options, fn ) {fn();} );
User.beforeBulkDelete( 'myHook', function( options, fn ) {fn();} );

User.afterBulkDestroy( function( options ) {throw new Error( 'Whoops!' );} );
User.afterBulkDestroy( function( options, fn ) {fn();} );
User.afterBulkDestroy( 'myHook', function( options, fn ) {fn();} );
User.afterBulkDelete( 'myHook', function( options, fn ) {fn();} );

User.beforeBulkUpdate( function( options ) {throw new Error( 'Whoops!' );} );
User.beforeBulkUpdate( 'myHook', function( options ) {throw new Error( 'Whoops!' );} );

User.afterBulkUpdate( function( options ) {throw new Error( 'Whoops!' );} );
User.afterBulkUpdate( 'myHook', function( options ) {throw new Error( 'Whoops!' );} );

User.beforeFind( function( options ) {} );
User.beforeFind( 'myHook', function( options ) {} );

User.beforeFindAfterExpandIncludeAll( function( options ) {} );
User.beforeFindAfterExpandIncludeAll( 'myHook', function( options ) {} );

User.beforeFindAfterOptions( function( options ) {} );
User.beforeFindAfterOptions( 'myHook', function( options ) {} );

User.afterFind( function( user ) {} );
User.afterFind( 'myHook', function( user ) {} );

User.beforeSync( function( options ) {} );
User.beforeSync( 'myHook', function( options ) {} );

User.afterSync( function( options ) {} );
User.afterSync( 'myHook', function( options ) {} );

s.beforeDefine( function( attributes, options ) {} );
s.beforeDefine( 'myHook', function( attributes, options ) {} );

s.afterDefine( function( model ) {} );
s.afterDefine( 'myHook', function( model ) {} );

s.beforeInit( function( config, options ) {} );
s.beforeInit( 'myHook', function( attributes, options ) {} );

s.afterInit( function( model ) {} );
s.afterInit( 'myHook', function( model ) {} );

s.beforeBulkSync( function( options ) {} );
s.beforeBulkSync( 'myHook', function( options ) {} );

s.afterBulkSync( function( options ) {} );
s.afterBulkSync( 'myHook', function( options ) {} );

s.define( 'User', {}, {
  hooks : {
    beforeValidate : function( user, options, fn ) {fn();},
    afterValidate : function( user, options, fn ) {fn();},
    beforeCreate : function( user, options, fn ) {fn();},
    afterCreate : function( user, options, fn ) {fn();},
    beforeDestroy : function( user, options, fn ) {fn();},
    afterDestroy : function( user, options, fn ) {fn();},
    beforeDelete : function( user, options, fn ) {fn();},
    afterDelete : function( user, options, fn ) {fn();},
    beforeUpdate : function( user, options, fn ) {fn();},
    afterUpdate : function( user, options, fn ) {fn();}
  }
} );

//
//  Instance
// ~~~~~~~~~~
//
//  https://github.com/sequelize/sequelize/blob/v3.4.1/test/integration/instance.test.js
//  https://github.com/sequelize/sequelize/blob/v3.4.1/test/integration/instance/update.test.js
//  https://github.com/sequelize/sequelize/blob/v3.4.1/test/integration/instance/values.test.js
//

user.isNewRecord = true;

user.Model.build( { a : 'b' } );

user.sequelize.close();

user.where();

user.getDataValue( '' );

user.setDataValue( '', '' );
user.setDataValue( '', {} );

user.get( 'aNumber', { plain : true, clone : true } );
user.get();

user.set( 'email', 'B' );
user.set( { name : 'B', bio : 'B' } ).save().then( ( p ) => p );
user.set( 'birthdate', new Date() );
user.set( { id : 1, t : 'c', q : [{ id : 1, n : 'a' }, { id : 2, n : 'Beta' }], u : { id : 1, f : 'b', l : 'd' } } );
user.setAttributes( { a : 3 } );
user.setAttributes( { id : 1, a : 'n', c : [{ id : 1 }, { id : 2, f : 'e' }], x : { id : 1, f : 'h', l : 'd' } } );

user.changed( 'name' );
user.changed();

user.previous( 'name' );

user.save().then( ( p ) => p );
user.save( { fields : ['a'] } ).then( ( p ) => p );
user.save( { transaction : t } );

user.reload();
user.reload( { attributes : ['bNumber'] } );
user.reload( { transaction : t } );

user.validate();

user.update( { bNumber : 2 }, { where : { id : 1 } } );
user.update( { username : 'userman' }, { silent : true } );
user.update( { username : 'yolo' }, { logging : function() { } } );
user.update( { username : 'bar' }, { where : { username : 'foo' }, transaction : t } ).then( ( p ) => p );
user.updateAttributes( { a : 3 } ).then( ( p ) => p );
user.updateAttributes( { a : 3 }, { fields : ['secretValue'], logging : function(  ) {} } );

user.destroy().then( ( p ) => p );
user.destroy( { logging : function(  ) {} } );
user.destroy( { transaction : t } ).then( ( p ) => p );

user.restore();

user.increment( 'number', { by : 2 } ).then( ( p ) => p );
user.increment( ['aNumber'], { by : 2, where : { bNumber : 1 } } ).then( ( p ) => p );
user.increment( ['aNumber'], { by : 2 } ).then( ( p ) => p );
user.increment( 'aNumber' ).then( ( p ) => p );
user.increment( { 'aNumber' : 1, 'bNumber' : 2 } ).then( ( p ) => p );
user.increment( 'number', { by : 2, transaction : t } ).then( ( p ) => p );

user.decrement( 'aNumber', { by : 2 } ).then( ( p ) => p );
user.decrement( ['aNumber'], { by : 2 } ).then( ( p ) => p );
user.decrement( 'aNumber' ).then( ( p ) => p );
user.decrement( { 'aNumber' : 1, 'bNumber' : 2 } ).then( ( p ) => p );
user.decrement( 'number', { by : 2, transaction : t } ).then( ( p ) => p );

user.equals( user );

user.equalsOneOf( [user, user] );

user.toJSON();


//  Model
// ~~~~~~~
//
//  https://github.com/sequelize/sequelize/blob/v3.4.1/test/integration/model.test.js
//

User.removeAttribute( 'id' );

User.sync( { force : true } ).then( function() { } );
User.sync( { force : true, logging : function() { } } );

User.drop();

User.schema( 'special' );
User.schema( 'special' ).create( { age : 3 }, { logging : function(  ) {} } );

User.getTableName();

User.addScope('lowAccess', { where : { parent_id : 2 } });
User.addScope('lowAccess', { where : { parent_id : 2 } }, { override: true });
User.addScope('lowAccessWithParam', function(id: number) {
  return { where : { parent_id : id } }
} );

User.scope( 'lowAccess' ).count();
User.scope( [ 'lowAccess', { method: ['lowAccessWithParam', 2] } ] )

User.findAll();
User.findAll( { where : { data : { employment : null } } } );
User.findAll( { where : { aNumber : { gte : 10 } } } ).then( ( u ) => u[0].isNewRecord );
User.findAll( { where : [s.or( { u : 'b' }, { u : ';' } ), s.and( { id : [1, 2] } )], include : [{ model : User }] } );
User.findAll( {
  where : [s.or( { a : 'b' }, { c : 'd' } ), s.and( { id : [1, 2, 3] },
    s.or( { deletedAt : null }, { deletedAt : { gt : new Date( 0 ) } } ) )]
} );
User.findAll( { paranoid : false, where : [' IS NOT NULL '], include : [{ model : User }] } );
User.findAll( { include : [{ model : Task, paranoid: false }] } );
User.findAll( { transaction : t } );
User.findAll( { where : { data : { name : { last : 's' }, employment : { $ne : 'a' } } }, order : [['id', 'ASC']] } );
User.findAll( { where : { username : ['boo', 'boo2'] } } );
User.findAll( { where : { username : { like : '%2' } } } );
User.findAll( { where : { theDate : { '..' : ['2013-01-02', '2013-01-11'] } } } );
User.findAll( { where : { intVal : { '!..' : [8, 10] } } } );
User.findAll( { where : { theDate : { between : ['2013-01-02', '2013-01-11'] } } } );
User.findAll( { where : { theDate : { between : ['2013-01-02', '2013-01-11'] }, intVal : 10 } } );
User.findAll( { where : { theDate : { between : ['2012-12-10', '2013-01-02'] } } } );
User.findAll( { where : { theDate : { nbetween : ['2013-01-04', '2013-01-20'] } } } );
User.findAll( { order : [s.col( 'name' )] } );
User.findAll( { order : [['theDate', 'DESC']] } );
User.findAll( { include : [User], order : [[User, User, 'numYears', 'c']] } );
User.findAll( { include : [{ model : User, include : [User, { model : User, as : 'residents' }] }] } );
User.findAll( { order : [[User, { model : User, as : 'residents' }, 'lastName', 'c']] } );
User.findAll( { include : [User], order : [[User, 'name', 'c']] } );
User.findAll( { include : [{ all : 'HasMany', attributes : ['name'] }] } );
User.findAll( { include : [{ all : true }, { model : User, attributes : ['id'] }] } );
User.findAll( { include : [{ all : 'BelongsTo' }] } );
User.findAll( { include : [{ all : true }] } );
User.findAll( { where : { username : 'barfooz' }, raw : true } );
User.findAll( { where : { name : 'worker' }, include : [{ model : User, as : 'ToDos' }] } );
User.findAll( { where : { user_id : 1 }, attributes : ['a', 'b'], include : [{ model : User, attributes : ['c'] }] } );
User.findAll( { order : s.literal( 'email =' ) } );
User.findAll( { order : [s.literal( 'email = ' + s.escape( 'test@sequelizejs.com' ) )] } );
User.findAll( { order : [['id', ';DELETE YOLO INJECTIONS']] } );
User.findAll( { include : [User], order : [[User, 'id', ';DELETE YOLO INJECTIONS']] } );
User.findAll( { include : [User], order : [['id', 'ASC NULLS LAST'], [User, 'id', 'DESC NULLS FIRST']] } );
User.findAll( { include : [{ model : User, where : { title : 'DoDat' }, include : [{ model : User }] }] } );
User.findAll( { attributes: ['username', 'data']});
User.findAll( { attributes: {include: ['username', 'data']} });
User.findAll( { attributes: [['username', 'user_name'], ['email', 'user_email']] });
User.findAll( { attributes: [s.fn('count', Sequelize.col('*'))] });
// currently suffering from flow union type bugs
// User.findAll( { attributes: [[s.fn('count', Sequelize.col('*')), 'count']] });
// User.findAll( { attributes: [[s.fn('count', Sequelize.col('*')), 'count']], group: ['sex'] });
// User.findAll( { attributes: [s.cast(s.fn('count', Sequelize.col('*')), 'INTEGER')] });
// User.findAll( { attributes: [[s.cast(s.fn('count', Sequelize.col('*')), 'INTEGER'), 'count']] });
User.findAll( { where : s.fn('count', [0, 10]) } );
User.findAll( { where: s.where(s.fn('lower', s.col('email')), s.fn('lower', 'TEST@SEQUELIZEJS.COM')) } );
User.findAll( { subQuery: false, include : [User], order : [[User, User, 'numYears', 'c']] } );
User.findAll( { rejectOnEmpty: true });


User.findById( 'a string' );

User.findOne( { where : { username : 'foo' } } );
User.findOne( { where : { id : 1 }, attributes : ['id', ['username', 'name']] } );
User.findOne( { where : { id : 1 }, attributes : ['id'] } );
User.findOne( { where : { username : 'foo' }, logging : function(  ) { } } );
User.findOne( { limit : 10 } );
User.findOne( { where : { title : 'homework' }, include : [User] } );
User.findOne( { where : { name : 'environment' }, include : [{ model : User, as : 'PrivateDomain' }] } );
User.findOne( { where : { username : 'foo' }, transaction : t } ).then( ( p ) => p );
User.findOne( { include : [User] } );
User.findOne( { include : [{ model : User, as : 'Work' }] } );
User.findOne( { where : { name : 'worker' }, include : [{ model : User, as : 'ToDo' }] } );
User.findOne( { include : [{ model : User, as : 'ToDo' }, { model : User, as : 'DoTo' }] } );
User.findOne( { where : { name : 'worker' }, include : [User] } );
User.findOne( { where : { name : 'Boris' }, include : [User, { model : User, as : 'Photos' }] } );
User.findOne( { where : { username : 'someone' }, include : [User] } );
User.findOne( { where : { username : 'barfooz' }, raw : true } );
User.findOne( { where : s.fn('count', []) } );
User.findOne( { where: s.where(s.fn('lower', s.col('email')), s.fn('lower', 'TEST@SEQUELIZEJS.COM')) } );
/* NOTE https://github.com/DefinitelyTyped/DefinitelyTyped/pull/5590
User.findOne( { updatedAt : { ne : null } } );
 */
User.find( { where : { intVal : { gt : 5 } } } );
User.find( { where : { intVal : { lte : 5 } } } );

User.count();
User.count( { transaction : t } );
User.count().then( function( c ) { c.toFixed(); } );
User.count( { where : ["username LIKE '%us%'"] } );
User.count( { include : [{ model : User, required : false }] } );
User.count( { distinct : true, include : [{ model : User, required : false }] } );
User.count( { attributes : ['data'], group : ['data'] } );
User.count( { where : { access_level : { gt : 5 } } } );

User.findAndCountAll( { offset : 5, limit : 1, include : [User, { model : User, as : 'a' }] } );

User.max( 'age', { transaction : t } );
User.max( 'age' );
User.max( 'age', { logging : function(  ) { } } );

User.min( 'age', { transaction : t } );
User.min( 'age' );
User.min( 'age', { logging : function(  ) { } } );

User.sum( 'order' );
User.sum( 'age', { where : { 'gender' : 'male' } } );
User.sum( 'age', { logging : function(  ) { } } );

User.build( { username : 'John Wayne' } ).save();
User.build();
User.build( { id : 1, T : [{ n : 'a' }, { id : 2 }], A : { id : 1, n : 'a', c : 'a' } }, { include : [User, Task] } );
User.build( { id : 1, }, { include : [{ model : User, as : 'followers' }, { model : Task, as : 'categories' }] } );

User.create();
User.create( { createdAt : 1, updatedAt : 2 }, { silent : true } );
User.create( {}, { returning : true } );
User.create( { intVal : s.literal( 'CAST(1-2 AS' ) } );
User.create( { secretValue : s.fn( 'upper', 'sequelize' ) } );
User.create( { myvals : [1, 2, 3, 4], mystr : ['One', 'Two', 'Three', 'Four'] } );
User.create( { name : 'Fluffy Bunny', smth : 'else' }, { logging : function(  ) {} } );
User.create( {}, { fields : [] } );
User.create( { name : 'Yolo Bear', email : 'yolo@bear.com' }, { fields : ['name'] } );
User.create( { title : 'Chair', User : { first_name : 'Mick', last_name : 'Broadstone' } }, { include : [User] } );
User.create( { title : 'Chair', creator : { first_name : 'Matt', last_name : 'Hansen' } }, { include : [User] } );
User.create( { id : 1, title : 'e', Tags : [{ id : 1, name : 'c' }, { id : 2, name : 'd' }] }, { include : [User] } );
User.create( { id : 'My own ID!' } ).then( ( i ) => i.isNewRecord );

let findOrRetVal: Promise<[Model<Object>, boolean]>;
findOrRetVal = User.findOrInitialize( { where : { username : 'foo' } } );
findOrRetVal = User.findOrInitialize( { where : { username : 'foo' }, transaction : t } );
findOrRetVal = User.findOrInitialize( { where : { username : 'foo' }, defaults : { foo : 'asd' }, transaction : t } );
findOrRetVal = User.findOrInitialize( { where : { username : 'foo' }, defaults : { foo : 'asd' }, paranoid : false } );

findOrRetVal = User.findOrCreate( { where : { a : 'b' }, defaults : { json : { a : { b : 'c' }, d : [1, 2, 3] } } } );
findOrRetVal = User.findOrCreate( { where : { a : 'b' }, defaults : { json : 'a', data : 'b' } } );
/* NOTE https://github.com/DefinitelyTyped/DefinitelyTyped/pull/5590
User.findOrCreate( { where : { a : 'b' }, transaction : t, lock : t.LOCK.UPDATE } );
 */
findOrRetVal = User.findOrCreate( { where : { a : 'b' }, logging : function(  ) { } } );
findOrRetVal = User.findOrCreate( { where : { username : 'Username' }, defaults : { data : 'some data' }, transaction : t } );
findOrRetVal = User.findOrCreate( { where : { objectId : 'asdasdasd' }, defaults : { username : 'gottlieb' } } );
findOrRetVal = User.findOrCreate( { where : { id : null }, defaults : { name : Math.random().toString() } } );
findOrRetVal = User.findOrCreate( { where : { email : 'unique.email.@d.com', companyId : Math.floor( Math.random() * 5 ) } } );
findOrRetVal = User.findOrCreate( { where : { objectId : 1 }, defaults : { bool : false } } );

User.upsert( { id : 42, username : 'doe', foo : s.fn( 'upper', 'mixedCase2' ) } );

User.bulkCreate( [{ aNumber : 10 }, { aNumber : 12 }] ).then( ( i ) => i[0].isNewRecord );
User.bulkCreate( [{ username : 'bar' }, { username : 'bar' }, { username : 'bar' }] );
User.bulkCreate( [{}, {}], { validate : true, individualHooks : true } );
User.bulkCreate( [{ style : 'ipa' }], { logging : function() { } } );
User.bulkCreate( [{ a : 'b', c : 'd', e : 'f' }, { a : 'b', c : 'd', e : 'f' }], { fields : ['a', 'b'] } );
User.bulkCreate( [{ name : 'foo', code : '123' }, { code : 'c' }, { name : 'bar', code : '1' }], { validate : true } );
User.bulkCreate( [{ name : 'foo', code : '123' }, { code : '1234' }], { fields : ['code'], validate : true } );
User.bulkCreate( [{ name : 'a', c : 'b' }, { name : 'e', c : 'f' }], { fields : ['e', 'f'], ignoreDuplicates : true } );

User.truncate();
User.truncate( { cascade : true } );
User.truncate( { force : true } );
User.truncate( { cascade: true, force : true } );

User.destroy( { where : { client_id : 13 } } ).then( ( a ) => a.toFixed() );
User.destroy( { force : true } );
User.destroy( { where : {}, transaction : t } );
User.destroy( { where : { access_level : { lt : 5 } } } );
User.destroy( { truncate : true } );
User.destroy( { where : {} } );

User.restore( { where : { secretValue : '42' } } );

User.update( { username : 'ruben' }, { where : {} } );
User.update( { username : 'ruben' }, { where : { access_level : { lt : 5 } } } );
User.update( { username : 'ruben' }, { where : { username : 'dan' } } );
User.update( { username : 'bar' }, { where : { username : 'foo' }, transaction : t } );
User.update( { username : 'Bill', secretValue : '43' }, { where : { secretValue : '42' }, fields : ['username'] } );
User.update( { username : s.cast( '1', 'char' ) }, { where : { username : 'John' } } );
User.update( { username : s.fn( 'upper', s.col( 'username' ) ) }, { where : { username : 'John' } } );
User.update( { username : 'Bill' }, { where : { secretValue : '42' }, returning : true } );
User.update( { secretValue : '43' }, { where : { username : 'Peter' }, limit : 1 } );
User.update( { name : Math.random().toString() }, { where : { id : '1' } } );
User.update( { a : { b : 10, c : 'd' } }, { where : { username : 'Jan' }, sideEffects : false } );
User.update( { geometry : { type : 'Point', coordinates : [49.807222, -86.984722] } }, {
  where : {
    u : {
      u : 'u',
      geometry : { type : 'Point', coordinates : [49.807222, -86.984722] }
    }
  }
} );
User.update( {
  geometry : {
    type : 'Polygon',
    coordinates : [[[100.0, 0.0], [102.0, 0.0], [102.0, 1.0], [100.0, 1.0], [100.0, 0.0]]]
  }
}, {
  where : {
    username : {
      username : 'username',
      geometry : { type : 'Point', coordinates : [49.807222, -86.984722] }
    }
  }
} );

User.unscoped().find( { where : { username : 'bob' } } );
User.unscoped().count();

//
//  Query Interface
// ~~~~~~~~~~~~~~~~~
//
//  https://github.com/sequelize/sequelize/blob/v3.4.1/test/integration/query-interface.test.js
//

let queryInterface = s.getQueryInterface();

queryInterface.dropAllTables();
queryInterface.showAllTables( { logging : function() { } } );
queryInterface.createTable( 'table', { name : Sequelize.STRING }, { logging : function() { } } );
queryInterface.createTable( 'skipme', { name : Sequelize.STRING } );
queryInterface.dropAllTables( { skip : ['skipme'] } );
queryInterface.dropTable( 'Group', { logging : function() { } } );
queryInterface.addIndex( 'Group', { fields: ['username', 'isAdmin'] } );
queryInterface.showIndex( 'Group', { logging : function() { } } );
queryInterface.removeIndex( 'Group', ['username', 'isAdmin'], { logging : function() { } } );
queryInterface.showIndex( 'Group' );
queryInterface.createTable( 'table', { name : { type : Sequelize.STRING } }, { schema : 'schema' } );
queryInterface.showIndex( { schema : 'schema', tableName : 'table' }, { logging : function() {} } );
queryInterface.describeTable( '_Users', { logging : function() {} } );
queryInterface.createTable( 's', { table_id : { type : Sequelize.INTEGER, primaryKey : true, autoIncrement : true } } );
queryInterface.createTable( 'SomeTable', { someEnum : Sequelize.ENUM( 'value1', 'value2', 'value3' ) } );
queryInterface.createTable( 'SomeTable', { someEnum : { type : Sequelize.ENUM, values : ['b1', 'b2', 'b3'] } } );
queryInterface.createTable( 't', { someEnum : { type : Sequelize.ENUM, values : ['c1', 'c2', 'c3'], field : 'd' } } );
queryInterface.createTable( 'User', { name : { type : Sequelize.STRING } }, { schema : 'hero' } );
queryInterface.rawSelect( 'User', { schema : 'hero', logging : function() {} }, 'name' );
queryInterface.renameColumn( '_Users', 'username', 'pseudo', { logging : function() {} } );
queryInterface.renameColumn( { schema : 'archive', tableName : 'Users' }, 'username', 'pseudo' );
queryInterface.renameColumn( '_Users', 'username', 'pseudo' );
queryInterface.createTable( { tableName : 'y', schema : 'a' },
  { id : { type : Sequelize.INTEGER, primaryKey : true, autoIncrement : true }, currency : Sequelize.INTEGER } );
queryInterface.changeColumn( { tableName : 'a', schema : 'b' }, 'c', { type : Sequelize.FLOAT },
  { logging : () => s } );
queryInterface.createTable( 'users', { id : { type : Sequelize.INTEGER, primaryKey : true, autoIncrement : true } } );
queryInterface.createTable( 'level', { id : { type : Sequelize.INTEGER, primaryKey : true, autoIncrement : true } } );
queryInterface.addColumn( 'users', 'someEnum', Sequelize.ENUM( 'value1', 'value2', 'value3' ) );
queryInterface.addColumn( 'users', 'so', { type : Sequelize.ENUM, values : ['value1', 'value2', 'value3'] } );
queryInterface.createTable( 'hosts', {
  id : {
    type : Sequelize.INTEGER,
    primaryKey : true,
    autoIncrement : true
  },
  admin : {
    type : Sequelize.INTEGER,
    references : {
      model : User,
      key : 'id'
    }
  },
  operator : {
    type : Sequelize.INTEGER,
    references : {
      model : User,
      key : 'id'
    },
    onUpdate : 'cascade'
  },
  owner : {
    type : Sequelize.INTEGER,
    references : {
      model : User,
      key : 'id'
    },
    onUpdate : 'cascade',
    onDelete : 'set null'
  }
} );
//
//
//  Query Types
// ~~~~~~~~~~~~~
//

s.getDialect();
s.validate();
s.authenticate();
s.isDefined( '' );
s.model( 'pp' );
s.query( '', { raw : true } );
s.query( '' );
s.query( '' ).then( function( res ) {} );
s.query( { query : 'select ? as foo, ? as bar', values : [1, 2] }, { raw : true, replacements : [1, 2] } );
s.query( '', { raw : true, nest : false } );
s.query( 'select ? as foo, ? as bar', { type : sequelize.QueryTypes.SELECT, replacements : [1, 2] } );
s.query( { query : 'select ? as foo, ? as bar', values : [1, 2] }, { type : s.QueryTypes.SELECT } );
s.query( 'select :one as foo, :two as bar', { raw : true, replacements : { one : 1, two : 2 } } );
s.transaction().then( function( t ) { s.set( { foo : 'bar' }, { transaction : t } ); } );
s.define( 'foo', { bar : Sequelize.STRING }, { collate : 'utf8_bin' } );
s.define( 'Foto', { name : Sequelize.STRING }, { tableName : 'photos' } );
s.databaseVersion().then( function( version ) { } );

//
//  Sequelize
// ~~~~~~~~~~~
//

new Sequelize( 'db', 'user', 'pw', { logging : false } );
new Sequelize( 'db', 'user', 'pass', {
  dialect : '',
  port : 99999,
  pool : {}
} );
new Sequelize( '' ).query( '', { type : s.QueryTypes.FOREIGNKEYS, logging : function() {} } );
new Sequelize( 'sqlite://test.sqlite' );
new Sequelize( 'wat', 'trololo', 'wow', { port : 99999 } );
new Sequelize( 'localhost', 'wtf', 'lol', { port : 99999 } );
new Sequelize( 'sequelize', null, null, {
  replication : {
    read : {
      host : 'localhost',
      username : 'omg',
      password : 'lol'
    }
  }
} );
new Sequelize( {
  database: 'db',
  username: 'user',
  password: 'pass',
  retry: {
    match: ['failed'],
    max: 3
  },
  typeValidation: true
} );

new Sequelize({
  operatorsAliases: false,
});

new Sequelize({
  operatorsAliases: {
    $and: Sequelize.Op.and,
    customAlias: Sequelize.Op.or,
  },
});

s.model( 'Project' );
s.models['Project'];
s.define( 'Project', {
  name : Sequelize.STRING
} );

let testModel = s.define( 'User', {
  username : Sequelize.STRING,
  secretValue : Sequelize.STRING,
  data : Sequelize.STRING,
  intVal : Sequelize.INTEGER,
  theDate : Sequelize.DATE,
  aBool : Sequelize.BOOLEAN
} );
testModel = s.define( 'FrozenUser', {}, { freezeTableName : true } );
s.define( 'UserWithClassAndInstanceMethods', {}, {
  classMethods : { doSmth : function() { return 1; } },
  instanceMethods : { makeItSo : function() { return 2; } }
} );
s.define( 'UserCol', {
  id : {
    type : Sequelize.STRING,
    defaultValue : 'User',
    primaryKey : true
  }
} );
s.define( 'UserWithTwoAutoIncrements', {
  userid : { type : Sequelize.INTEGER, primaryKey : true, autoIncrement : true },
  userscore : { type : Sequelize.INTEGER, primaryKey : true, autoIncrement : true }
} );
s.define( 'Foo', {
  field : Sequelize.INTEGER
}, {
  validate : {
    field : function() {}
  }
} );
let UserTable = s.define( 'UserCol', {
  aNumber : Sequelize.INTEGER,
  createdAt : {
    type : Sequelize.DATE,
    defaultValue : new Date()
  },
  updatedAt : {
    type : Sequelize.DATE,
    defaultValue : new Date()
  }
}, { timestamps : true } );

s.define( 'UserCol', {
  aNumber : Sequelize.INTEGER
}, {
  timestamps : true,
  updatedAt : 'updatedOn',
  createdAt : 'dateCreated',
  deletedAt : 'deletedAtThisTime',
  paranoid : true
} );
s.define( 'UpdatingUser', {
  name : Sequelize.STRING
}, {
  timestamps : true,
  updatedAt : false,
  createdAt : false,
  deletedAt : 'deletedAtThisTime',
  paranoid : true
} );
s.define( 'TaskBuild', {
  title : {
    type : Sequelize.STRING( 50 ),
    allowNull : false,
    defaultValue : ''
  }
}, {
  setterMethods : {
    title : function() { }
  }
} );
s.define( 'UserCol', {
  aNumber : Sequelize.INTEGER
}, {
  paranoid : true,
  underscored : true
} );

s.define( 'UserWithUniqueUsername', {
  username : { type : Sequelize.STRING, unique : { name : 'user_and_email', msg : 'User and email must be unique' } },
  email : { type : Sequelize.STRING, unique : 'user_and_email' }
} );

s.define( 'UserWithUniqueUsername', {
  user_id : { type : Sequelize.INTEGER },
  email : { type : Sequelize.STRING }
}, {
  indexes : [
    {
      name : 'user_and_email_index',
      unique : true,
      method : 'BTREE',
      fields : ['user_id', { attribute : 'email', collate : 'en_US', order : 'DESC', length : 5 }],
      where : {
        user_id : { $not: null }
      }
    },
    {
      fields: ['data'],
      using: 'gin',
      operator: 'jsonb_path_ops'
    }
  ]
} );

s.define( 'TaskBuild', {
  title : { type : Sequelize.STRING, defaultValue : 'a task!' },
  foo : { type : Sequelize.INTEGER, defaultValue : 2 },
  bar : { type : Sequelize.DATE },
  foobar : { type : Sequelize.TEXT, defaultValue : 'asd' },
  flag : { type : Sequelize.BOOLEAN, defaultValue : false }
} );
s.define( 'ProductWithSettersAndGetters1', {
  price : {
    type : Sequelize.INTEGER,
    get : function() {
      return 'answer = ' + this.getDataValue( 'price' );
    },
    set : function( v: number ) {
      return this.setDataValue( 'price', v + 42 );
    }
  }
} );
s.define( 'ProductWithSettersAndGetters2', {
  priceInCents : Sequelize.INTEGER
}, {
  setterMethods : {
    price : function( value ) {
      this.dataValues.priceInCents = value * 100;
    }
  },
  getterMethods : {
    price : function() {
      return '$' + (this.getDataValue( 'priceInCents' ) / 100);
    },

    priceInCents : function() {
      return this.dataValues.priceInCents;
    }
  }
} );

s.define( 'post', {
  title : Sequelize.STRING,
  authorId : { type : Sequelize.INTEGER, references : testModel, referencesKey : 'id' }
} );
s.define( 'post', {
  title : Sequelize.STRING,
  authorId : { type : Sequelize.INTEGER, references : { model : testModel, key : 'id' } }
} );

s.define( 'User', {
  username : Sequelize.STRING,
  geometry : Sequelize.GEOMETRY( 'POINT' )
} );

s.define( 'ScopeMe', {
  username : Sequelize.STRING,
  email : Sequelize.STRING,
  access_level : Sequelize.INTEGER,
  other_value : Sequelize.INTEGER,
  parent_id : Sequelize.INTEGER
}, {
  defaultScope : {
    where : {
      access_level : {
        gte : 5
      }
    }
  },
  scopes : {
    isTony : {
      where : {
        username : 'tony'
      }
    },
  }
} );
s.define( 'company', {
  active : Sequelize.BOOLEAN
}, {
  defaultScope : {
    where : { active : true }
  },
  scopes : {
    notActive : {
      where : {
        active : false
      }
    },
    reversed : {
      order : [['id', 'DESC']]
    }
  }
} );
s.define( 'profile', {
  active : Sequelize.BOOLEAN
}, {
  defaultScope : {
    where : { active : true }
  },
  scopes : {
    notActive : {
      where : {
        active : false
      }
    },
  }
} );

s.define( 'ScopeMe', {
  username : Sequelize.STRING,
  email : Sequelize.STRING,
  access_level : Sequelize.INTEGER,
  other_value : Sequelize.INTEGER
}, {
  defaultScope : {
    where : {
      access_level : {
        gte : 5
      }
    }
  },
  scopes : {
    lowAccess : {
      where : {
        access_level : {
          lte : 5
        }
      }
    },
    withOrder : {
      order : 'username'
    }
  }
} );

// Generic find options
interface ChairAttributes {
  id: number;
  color: string;
  legs: number;
}
declare class ChairInstance extends Model<ChairAttributes> {}

const Chair = s.define('chair', {});

Chair.findAll({
  where: {
    color: 'blue',
    legs: { $in: [3, 4] },
  },
});

// https://github.com/facebook/flow/issues/3258 :(
// Chair.findAll({
//   where: {
//     color: 'blue',
//     legs: { [Sequelize.Op.in]: [3, 4] },
//   },
// });

// If you want to use a property that isn't explicitly on the model's Attributes
// use the find-function's generic type parameter.
Chair.findAll({
  where: {
    customProperty: 123,
  }
});
Chair.findAll({
  where: {
    customProperty1: 123,
    customProperty2: 456,
  }
});

s.define( 'ScopeMe', {
  username : Sequelize.STRING,
  email : Sequelize.STRING,
  access_level : Sequelize.INTEGER,
  other_value : Sequelize.INTEGER
}, {
  defaultScope : {
    where : {
      access_level : {
        gte : 5
      }
    }
  },
  scopes : {
    lowAccess : {
      where : {
        access_level : {
          lte : 5
        }
      }
    }
  }
} );

s.define( 'user', {
  id : {
    type : Sequelize.INTEGER,
    allowNull : false,
    primaryKey : true,
    autoIncrement : true,
    field : 'userId'
  },
  name : {
    type : Sequelize.STRING,
    field : 'full_name'
  },
  taskCount : {
    type : Sequelize.INTEGER,
    field : 'task_count',
    defaultValue : 0,
    allowNull : false
  }
}, {
  tableName : 'users',
  timestamps : false
} );
s.define( 'task', {
  id : {
    type : Sequelize.INTEGER,
    allowNull : false,
    primaryKey : true,
    autoIncrement : true,
    field : 'taskId'
  },
  title : {
    type : Sequelize.STRING,
    field : 'name'
  }
}, {
  tableName : 'tasks',
  timestamps : false
} );
s.define( 'comment', {
  id : {
    type : Sequelize.INTEGER,
    allowNull : false,
    primaryKey : true,
    autoIncrement : true,
    field : 'commentId'
  },
  text : {
    type : Sequelize.STRING,
    field : 'comment_text'
  },
  notes : {
    type : Sequelize.STRING,
    field : 'notes'
  }
}, {
  tableName : 'comments',
  timestamps : false
} );
s.define( 'test', {
  id : {
    type : Sequelize.INTEGER,
    field : 'test_id',
    autoIncrement : true,
    primaryKey : true,
    validate : {
      min : 1
    }
  },
  title : {
    allowNull : false,
    type : Sequelize.STRING( 255 ),
    field : 'test_title'
  }
}, {
  timestamps : true,
  underscored : true,
  freezeTableName : true
} );
s.define( 'testBooeanVersionOption', {
  version : {
    type : Sequelize.INTEGER,
  }
}, {
  version: true
} );
s.define( 'testStringVersionOption', {
  nameOfOptimisticLockColumn : {
    type : Sequelize.INTEGER,
  }
}, {
  version: "nameOfOptimisticLockColumn"
} );
s.define( 'User', {
  deletedAt : {
    type : Sequelize.DATE,
    field : 'deleted_at'
  }
}, {
  timestamps : true,
  paranoid : true
} );

s.define( 'TriggerTest', {
  id : {
    type : Sequelize.INTEGER,
    field : 'test_id',
    autoIncrement : true,
    primaryKey : true,
    validate : {
      min : 1
    }
  },
  title : {
    allowNull : false,
    type : Sequelize.STRING( 255 ),
    field : 'test_title'
  }
}, {
  timestamps : false,
  underscored : true,
  hasTrigger : true
} );

s.define('DefineOptionsIndexesTest', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    validate: {
      min: 1
    }
  },
  email: {
    allowNull: false,
    type: Sequelize.STRING(255),
    set: function (val) {
      if (typeof val === "string") {
        val = val.toLowerCase();
      } else {
        throw new Error("email must be a string");
      }
      this.setDataValue("email", val);
    }
  }
}, {
  timestamps: false,
  indexes: [
    {
      name: "DefineOptionsIndexesTest_lower_email",
      unique: true,
      fields: [
        Sequelize.fn("LOWER", Sequelize.col("email"))
      ]
    }
  ]
} );

//
//  Transaction
// ~~~~~~~~~~~~~
//
//  https://github.com/sequelize/sequelize/blob/v3.4.1/test/integration/transaction.test.js
//

s.transaction().then( function( t ) {

  t.commit();
  t.rollback();

  User.find( {
    where : {
      username : 'John'
    },
    include : [User],
    lock : t.LOCK.UPDATE,
    transaction : t
  } );
  User.find( {
    where : {
      username : 'John'
    },
    include : [User],
    lock : {
      level : t.LOCK.UPDATE,
      of : User
    },
    transaction : t
  } );
  User.update( {
    active : true
  }, {
    where : {
      active : false
    },
    transaction : t
  } );
  User.find( {
    where : {
      username : 'jan'
    },
    lock : t.LOCK.NO_KEY_UPDATE,
    transaction : t
  } );
  User.find( {
    where : {
      username : 'jan'
    },
    lock : t.LOCK.KEY_SHARE,
    transaction : t
  } );

} );

s.transaction({
  isolationLevel: s.Transaction.ISOLATION_LEVELS.READ_COMMITTED
}).then(function(t2) {
  return User.find({
    where: {
      username: 'jan'
    },
    lock: t2.LOCK.UPDATE,
    transaction: t2
  });
});

let autoCallback = (t: Transaction):Promise<string> => { return Promise.resolve('a') }
let callbackValidator = (r:string) => {}
s.transaction( autoCallback ).then( callbackValidator );
s.transaction( { isolationLevel : 'SERIALIZABLE' }, autoCallback ).then( callbackValidator );
s.transaction( { isolationLevel : s.Transaction.ISOLATION_LEVELS.SERIALIZABLE }, autoCallback ).then( callbackValidator );
s.transaction( { isolationLevel : s.Transaction.ISOLATION_LEVELS.READ_COMMITTED }, autoCallback ).then( callbackValidator );

// transaction types
new Sequelize( '', { transactionType: 'DEFERRED' } );
new Sequelize( '', { transactionType: Sequelize.Transaction.TYPES.DEFERRED} );
new Sequelize( '', { transactionType: Sequelize.Transaction.TYPES.IMMEDIATE} );
new Sequelize( '', { transactionType: Sequelize.Transaction.TYPES.EXCLUSIVE} );
s.transaction( { type : 'DEFERRED' }, (t) => Promise.resolve() );
s.transaction( { type : s.Transaction.TYPES.DEFERRED }, (t) => Promise.resolve() );
s.transaction( { type : s.Transaction.TYPES.IMMEDIATE }, (t) => Promise.resolve() );
s.transaction( { type : s.Transaction.TYPES.EXCLUSIVE }, (t) => Promise.resolve() );

// promise transaction
let asyncAutoCallback = async (t: Transaction):Promise<string> => 'a'
s.transaction( asyncAutoCallback ).then( callbackValidator );

// sync options types
s.sync({
  alter: true,
  force: true,
  hooks: false,
  searchPath: 'some/path/',
  schema: 'schema',
  logging: () => {},
  match: new RegExp('\d{4,}')
});
