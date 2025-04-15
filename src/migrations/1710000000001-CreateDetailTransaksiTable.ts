import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";
import { DataSource } from "typeorm";

export class CreateDetailTransaksiTable1710000000001 implements MigrationInterface {
    name = 'CreateDetailTransaksiTable1710000000001'

    constructor(private readonly dataSource: DataSource) {}

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "detail_transaksi",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "transaksi_id",
                        type: "int",
                    },
                    {
                        name: "barang_id",
                        type: "int",
                    },
                    {
                        name: "jumlah",
                        type: "int",
                    },
                    {
                        name: "harga_satuan",
                        type: "decimal",
                        precision: 10,
                        scale: 2,
                    },
                    {
                        name: "subtotal",
                        type: "decimal",
                        precision: 10,
                        scale: 2,
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
            "detail_transaksi",
            new TableForeignKey({
                columnNames: ["transaksi_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "transaksi",
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "detail_transaksi",
            new TableForeignKey({
                columnNames: ["barang_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "barang",
                onDelete: "RESTRICT",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("detail_transaksi");
        const foreignKeys = table?.foreignKeys;
        
        if (foreignKeys) {
            for (const foreignKey of foreignKeys) {
                await queryRunner.dropForeignKey("detail_transaksi", foreignKey);
            }
        }
        
        await queryRunner.dropTable("detail_transaksi");
    }
} 