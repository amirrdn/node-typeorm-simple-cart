import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";
import { DataSource } from "typeorm";

export class CreateTransaksiTable1710000000000 implements MigrationInterface {
    name = 'CreateTransaksiTable1710000000000'

    constructor(private readonly dataSource: DataSource) {}

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "transaksi",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "user_id",
                        type: "int",
                    },
                    {
                        name: "kode_transaksi",
                        type: "varchar",
                        length: "50",
                        isUnique: true,
                    },
                    {
                        name: "tanggal",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "total_harga",
                        type: "decimal",
                        precision: 10,
                        scale: 2,
                    },
                    {
                        name: "status",
                        type: "enum",
                        enum: ["pending", "dibayar", "diproses", "dikirim", "selesai", "dibatalkan"],
                        default: "'pending'",
                    },
                    {
                        name: "catatan",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "transaksi",
            new TableForeignKey({
                columnNames: ["user_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "user",
                onDelete: "RESTRICT",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("transaksi");
        const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.indexOf("user_id") !== -1);
        if (foreignKey) {
            await queryRunner.dropForeignKey("transaksi", foreignKey);
        }
        await queryRunner.dropTable("transaksi");
    }
} 