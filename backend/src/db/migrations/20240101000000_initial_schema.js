exports.up = function(knex) {
  return knex.schema
    .createTable('users', table => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email').unique().notNullable();
      table.string('password').notNullable();
      table.string('bank_details');
      table.timestamps(true, true);
    })
    .createTable('groups', table => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.integer('creator_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table.timestamps(true, true);
    })
    .createTable('group_memberships', table => {
      table.increments('id').primary();
      table.integer('group_id')
        .references('id')
        .inTable('groups')
        .onDelete('CASCADE');
      table.integer('user_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table.unique(['group_id', 'user_id']);
    })
    .createTable('expenses', table => {
      table.increments('id').primary();
      table.integer('group_id')
        .references('id')
        .inTable('groups')
        .onDelete('CASCADE');
      table.integer('payer_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table.string('description').notNullable();
      table.decimal('total_amount', 10, 2).notNullable();
      table.timestamps(true, true);
    })
    .createTable('expense_splits', table => {
      table.increments('id').primary();
      table.integer('expense_id')
        .references('id')
        .inTable('expenses')
        .onDelete('CASCADE');
      table.integer('user_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table.decimal('amount_owed', 10, 2).notNullable();
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('expense_splits')
    .dropTableIfExists('expenses')
    .dropTableIfExists('group_memberships')
    .dropTableIfExists('groups')
    .dropTableIfExists('users');
};