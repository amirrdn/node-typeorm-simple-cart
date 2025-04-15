import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreatePembayaranTable1710000000002 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "pembayaran",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                        isNullable: false
                    },
                    {
                        name: "transaksi_id",
                        type: "int",
                        isNullable: false
                    },
                    {
                        name: "jumlah_pembayaran",
                        type: "decimal",
                        precision: 10,
                        scale: 2,
                        isNullable: false
                    },
                    {
                        name: "metode_pembayaran",
                        type: "enum",
                        enum: ["TUNAI", "TRANSFER", "KARTU_KREDIT", "KARTU_DEBIT", "E_WALLET"],
                        default: "'TUNAI'",
                        isNullable: false
                    },
                    {
                        name: "status_pembayaran",
                        type: "enum",
                        enum: ["PENDING", "SUCCESS", "FAILED"],
                        default: "'PENDING'",
                        isNullable: false
                    },
                    {
                        name: "nomor_referensi",
                        type: "varchar",
                        length: "255",
                        isNullable: true
                    },
                    {
                        name: "catatan",
                        type: "text",
                        isNullable: true
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        isNullable: false
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                        isNullable: false
                    }
                ]
            }),
            true
        );

        await queryRunner.createForeignKey(
            "pembayaran",
            new TableForeignKey({
                columnNames: ["transaksi_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "transaksi",
                onDelete: "CASCADE"
            })
        );

        await queryRunner.createIndex(
            "pembayaran",
            new TableIndex({
                name: "idx_pembayaran_transaksi",
                columnNames: ["transaksi_id"]
            })
        );

        await queryRunner.createIndex(
            "pembayaran",
            new TableIndex({
                name: "idx_pembayaran_status",
                columnNames: ["status_pembayaran"]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex("pembayaran", "idx_pembayaran_status");
        await queryRunner.dropIndex("pembayaran", "idx_pembayaran_transaksi");
        
        const table = await queryRunner.getTable("pembayaran");
        const foreignKey = table?.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("transaksi_id") !== -1
        );
        if (foreignKey) {
            await queryRunner.dropForeignKey("pembayaran", foreignKey);
        }
        
        await queryRunner.dropTable("pembayaran");
    }
} 