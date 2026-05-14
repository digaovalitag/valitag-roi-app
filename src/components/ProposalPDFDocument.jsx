import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Link } from '@react-pdf/renderer';
import { calculateROI } from '../logic/roiEngine';
import logoUrl from '../assets/logo-valitag.png.jpeg';
import imgElgin from '../assets/elginl42profull.png';
import imgZebra from '../assets/zebrazd230.jpg';
import imgArgox from '../assets/argoxos214ex.jfif';

const LOCAL_PRINTER_IMAGES = [imgElgin, imgZebra, imgArgox];
const formatMoney = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

const primaryColor = '#0084d1';
const dangerColor = '#dc2626';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottomWidth: 2,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 15,
    marginBottom: 30
  },
  headerLeft: {
    flex: 1
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b'
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4
  },
  logoMini: {
    width: 100,
    opacity: 0.5
  },
  logoCover: {
    width: 200,
    alignSelf: 'center',
    marginBottom: 30
  },
  coverTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginTop: 30
  },
  coverSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 10
  },
  boxTarget: {
    marginTop: 60,
    padding: 30,
    backgroundColor: '#f8fafc',
    borderWidth: 2,
    borderColor: '#f1f5f9',
    borderRadius: 10,
    alignItems: 'center'
  },
  clientName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: primaryColor,
    marginTop: 10,
    textAlign: 'center'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10
  },
  card: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden'
  },
  cardHeader: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cardBody: {
    padding: 12,
    backgroundColor: '#ffffff'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  textSmall: {
    fontSize: 10,
    color: '#64748b'
  },
  textBold: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b'
  },
  textDanger: {
    color: dangerColor,
    fontWeight: 'bold',
    fontSize: 14
  },
  alertBox: {
    backgroundColor: '#fef2f2',
    borderLeftWidth: 4,
    borderLeftColor: dangerColor,
    padding: 15,
    marginBottom: 20,
    borderRadius: 4
  },
  infoBox: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20
  },
  totalBox: {
    backgroundColor: '#f1f5f9',
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20
  },
  hugeTextDanger: {
    fontSize: 36,
    fontWeight: 'bold',
    color: dangerColor,
    marginTop: 15
  },
  planBox: {
    borderWidth: 2,
    borderColor: primaryColor,
    borderRadius: 10,
    marginBottom: 30
  },
  planHeader: {
    backgroundColor: primaryColor,
    color: '#ffffff',
    padding: 15,
    alignItems: 'center'
  },
  planBody: {
    padding: 30,
    alignItems: 'center'
  },
  priceHuge: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#1e40af',
    marginTop: 10
  },
  priceStrikethrough: {
    fontSize: 16,
    color: '#94a3b8',
    textDecoration: 'line-through'
  },
  hardwareGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  printerCard: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    marginBottom: 15,
    padding: 10
  },
  printerImage: {
    height: 80,
    objectFit: 'contain',
    marginBottom: 10
  },
  btnLink: {
    backgroundColor: primaryColor,
    color: '#ffffff',
    padding: 8,
    textAlign: 'center',
    borderRadius: 4,
    marginTop: 10,
    fontSize: 10,
    textDecoration: 'none'
  },
  btnSuccess: {
    backgroundColor: '#059669',
    color: '#ffffff',
    padding: 15,
    textAlign: 'center',
    borderRadius: 8,
    marginTop: 20,
    fontSize: 14,
    fontWeight: 'bold',
    textDecoration: 'none'
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: 20
  },
  stepIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#dbeafe',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  stepIconText: {
    color: '#1d4ed8',
    fontWeight: 'bold',
    fontSize: 14
  },
  stepContent: {
    flex: 1
  },
  crossSellBox: {
    marginTop: 40,
    backgroundColor: '#1e293b',
    padding: 25,
    borderRadius: 10,
    alignItems: 'center'
  },
  crossSellTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: primaryColor,
    marginBottom: 10,
    textTransform: 'uppercase'
  },
  footerLink: {
    color: primaryColor,
    fontSize: 12,
    textDecoration: 'underline',
    marginRight: 15,
    marginBottom: 10
  }
});

export default function ProposalPDFDocument({ estabelecimento, proprietario, responsavel, fat, planoId, descontoTaxa, descontoRs, descontoPlanoRs, descontoLicencasRs, descontoSetupLicencasRs, questions, responses, pricingConfig, hardwareConfig, linksConfig, licencasAdicionais = 0, validadeProposta, validadeSetup, skipDiagnostic }) {
  const roi = calculateROI(fat, planoId, descontoTaxa, descontoRs, descontoPlanoRs, descontoLicencasRs, descontoSetupLicencasRs, questions, responses, pricingConfig, licencasAdicionais);
  const plano = pricingConfig?.planos[planoId] || pricingConfig?.planos.starter;

  const modules = [
    { title: 'Perda por Validade', value: roi.perdaValidadeMensal, details: roi.detalhes?.validade || [] },
    { title: 'Quebra de Estoque', value: roi.perdaEstoqueMensal, details: roi.detalhes?.estoque || [] },
    { title: 'Eficiência Operacional', value: roi.prejuizoEficiencia, details: roi.detalhes?.eficiencia || [] }
  ].filter(m => m.value > 0).sort((a, b) => b.value - a.value);

  const isStarter = planoId === 'starter';
  const hasCriticalCmv = responses['cmv'] >= 35;

  return (
    <Document>
      {/* CAPA */}
      <Page size="A4" style={[styles.page, { justifyContent: 'center' }]}>
        <Image src={logoUrl} style={styles.logoCover} />
        <View style={{ width: 60, height: 4, backgroundColor: primaryColor, alignSelf: 'center', borderRadius: 2 }} />
        
        <Text style={styles.coverTitle}>PROPOSTA COMERCIAL</Text>
        {!skipDiagnostic && <Text style={styles.coverSubtitle}>E ANÁLISE DE ROI</Text>}

        <View style={styles.boxTarget}>
          <Text style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase' }}>Preparado para:</Text>
          <Text style={styles.clientName}>{estabelecimento || 'Cliente'}</Text>
          {(proprietario || responsavel) && (
            <Text style={{ fontSize: 14, color: '#475569', marginTop: 15 }}>
              A/C: {[proprietario, responsavel].filter(Boolean).join(' e ')}
            </Text>
          )}
        </View>

        <View style={{ marginTop: 80, alignItems: 'center' }}>
          <Text style={styles.textSmall}>Data de Emissão: {new Date().toLocaleDateString('pt-BR')}</Text>
          <Text style={styles.textSmall}>Validade: 48 horas</Text>
        </View>
      </Page>

      {/* DIAGNÓSTICO */}
      {!skipDiagnostic && (
        <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>O Dossiê da Sangria</Text>
            <Text style={styles.headerSubtitle}>Mapeamento de perdas e gargalos identificados na sua operação.</Text>
          </View>
          <Image src={logoUrl} style={styles.logoMini} />
        </View>

        {hasCriticalCmv ? (
          <View style={styles.alertBox}>
            <Text style={[styles.sectionTitle, { color: dangerColor }]}>Alerta Crítico: CMV em Nível de Sangria</Text>
            <Text style={{ fontSize: 12, color: '#7f1d1d' }}>
              O CMV selecionado de {responses['cmv']}% indica falta de controle rigoroso de validades e estoque, corroendo severamente a margem de lucro.
            </Text>
          </View>
        ) : null}

        {modules.map((mod, idx) => (
          <View key={idx} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.textBold}>{mod.title}</Text>
              <Text style={styles.textDanger}>-{formatMoney(mod.value)}/mês</Text>
            </View>
            <View style={styles.cardBody}>
              {mod.details.map((det, i) => (
                <View key={i} style={styles.row}>
                  <Text style={styles.textSmall}>{det.val} {det.unit}</Text>
                  <Text style={styles.textBold}>{formatMoney(det.loss)}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.totalBox}>
          <Text style={[styles.sectionTitle, { textTransform: 'uppercase' }]}>O Custo da Inação Anual</Text>
          <Text style={styles.textSmall}>Se nada for feito, este será o valor perdido no próximo ano.</Text>
          <Text style={styles.hugeTextDanger}>-{formatMoney(roi.totalPerdaAnual)}</Text>
          <Text style={{ fontSize: 12, color: '#475569', marginTop: 15 }}>
            Cada dia sem Valitag custa {formatMoney(roi.totalPerdaDiaria)} para o seu caixa.
          </Text>
        </View>
        <View style={{ marginVertical: 30, borderBottomWidth: 2, borderBottomColor: '#e2e8f0' }} />
        </Page>
      )}

      {/* INVESTIMENTO E PLANOS */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Proposta de Investimento</Text>
            <Text style={styles.headerSubtitle}>A solução exata para blindar o seu lucro.</Text>
          </View>
          <Image src={logoUrl} style={styles.logoMini} />
        </View>

        <View style={styles.planBox}>
          <View style={styles.planHeader}>
            <Text style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Plano Selecionado</Text>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 5, marginBottom: plano.description ? 5 : 0 }}>{plano.nome}</Text>
            {plano.description && (
              <Text style={{ fontSize: 11, color: '#e2e8f0', opacity: 0.9 }}>{plano.description}</Text>
            )}
          </View>
          <View style={styles.planBody}>
            {plano.features && plano.features.length > 0 && (
              <View style={{ marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingBottom: 15, width: '100%', paddingHorizontal: 20 }}>
                <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#475569', marginBottom: 8, textTransform: 'uppercase', textAlign: 'center' }}>O que está incluso:</Text>
                {plano.features.map((feat, idx) => (
                  <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 }}>
                    <Text style={{ fontSize: 12, color: '#0084d1', marginRight: 8, marginTop: -1 }}>•</Text>
                    <Text style={{ fontSize: 11, color: '#334155', flex: 1, lineHeight: 1.4 }}>{feat}</Text>
                  </View>
                ))}
                {licencasAdicionais > 0 && (
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6, backgroundColor: '#ecfdf5', padding: 4, borderRadius: 4 }}>
                    <Text style={{ fontSize: 12, color: '#059669', marginRight: 8, marginTop: -1 }}>•</Text>
                    <Text style={{ fontSize: 11, color: '#065f46', flex: 1, lineHeight: 1.4, fontWeight: 'bold' }}>
                      + {licencasAdicionais} Licença(s) Adicional(is) (PDVs / Lojas Extras)
                    </Text>
                  </View>
                )}
              </View>
            )}
            
            {planoId === 'starter' ? (
              <View style={{ backgroundColor: '#eff6ff', padding: 15, borderRadius: 8, marginBottom: 20, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#bfdbfe' }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#1e40af', marginBottom: 4, textTransform: 'uppercase' }}>
                  {skipDiagnostic ? 'Vantagem do Plano' : 'Economia Identificada'}
                </Text>
                <Text style={{ fontSize: 10, color: '#1e3a8a', textAlign: 'center', lineHeight: 1.4 }}>
                  {skipDiagnostic ? 'Padronização rápida e robusta para toda a operação.' : 'Foram identificados valores passíveis de economia com base na operação atual.'}
                </Text>
              </View>
            ) : (
              <View style={{ backgroundColor: '#ecfdf5', padding: 15, borderRadius: 8, marginBottom: 20, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#a7f3d0' }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#065f46', marginBottom: 4, textTransform: 'uppercase' }}>
                  {skipDiagnostic ? 'Aceleração de Resultados' : 'Economia Projetada'}
                </Text>
                <Text style={{ fontSize: 10, color: '#047857', textAlign: 'center', lineHeight: 1.4 }}>
                  {skipDiagnostic ? 'Com a Valitag, você estanca perdas financeiras desde o primeiro mês de operação.' : `Este plano proporciona uma economia projetada de ${formatMoney(roi.economiaDoPlanoMensal)} ao mês em relação às perdas mapeadas.`}
                </Text>
              </View>
            )}

            <View style={{ backgroundColor: '#f8fafc', padding: 20, borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0', width: '100%', alignItems: 'center' }}>
              <Text style={{ fontSize: 14, color: '#0f172a', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: 20 }}>Resumo Final do Investimento</Text>
              
              {/* MENSALIDADE TOTAL */}
              <View style={{ width: '100%', alignItems: 'center', marginBottom: 20 }}>
                <Text style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>
                  {licencasAdicionais > 0 ? `Mensalidade Total (Plano + ${licencasAdicionais} Licenças)` : 'Mensalidade Total (Plano Base)'}
                </Text>
                
                {roi.custoPlanoBaseFinal + roi.custoLicencasFinal < roi.custoBasePlano + roi.valorLicencas ? (
                  <View style={{ alignItems: 'center', marginTop: 10 }}>
                    <View style={{ backgroundColor: '#fef08a', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginBottom: 5 }}>
                      <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#854d0e', textTransform: 'uppercase' }}>Ajuste Comercial</Text>
                    </View>
                    <Text style={styles.priceStrikethrough}>{formatMoney(roi.custoBasePlano + roi.valorLicencas)}</Text>
                    <Text style={styles.priceHuge}>{formatMoney(roi.custoPlanoBaseFinal + roi.custoLicencasFinal)}</Text>
                  </View>
                ) : (
                  <Text style={styles.priceHuge}>{formatMoney(roi.custoPlanoBaseFinal + roi.custoLicencasFinal)}</Text>
                )}
              </View>

              {/* SETUP TOTAL */}
              <View style={{ width: '100%', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#cbd5e1', paddingTop: 20 }}>
                <Text style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>
                  {licencasAdicionais > 0 ? `Taxa Única de Implantação (Setup + ${licencasAdicionais} Licenças)` : 'Taxa Única de Implantação (Setup Base)'}
                </Text>
                
                {roi.custoImplantacaoBaseFinal + roi.custoImplantacaoLicencasFinal < roi.taxaBase + roi.taxaLicencas ? (
                  <View style={{ alignItems: 'center', marginTop: 10 }}>
                    <View style={{ backgroundColor: '#fef08a', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginBottom: 5 }}>
                      <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#854d0e', textTransform: 'uppercase' }}>Bônus Comercial de Setup</Text>
                    </View>
                    <Text style={styles.priceStrikethrough}>{formatMoney(roi.taxaBase + roi.taxaLicencas)}</Text>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#059669' }}>{formatMoney(roi.custoImplantacaoBaseFinal + roi.custoImplantacaoLicencasFinal)}</Text>
                  </View>
                ) : (
                  <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#059669', marginTop: 5 }}>{formatMoney(roi.custoImplantacaoBaseFinal + roi.custoImplantacaoLicencasFinal)}</Text>
                )}
              </View>
              
              {/* VALIDADES */}
              <View style={{ width: '100%', marginTop: 20, paddingTop: 15, borderTopWidth: 1, borderTopStyle: 'dashed', borderTopColor: '#cbd5e1', flexDirection: 'row', justifyContent: 'space-around' }}>
                {validadeProposta && (
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 9, color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Validade da Proposta</Text>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#0f172a', marginTop: 4 }}>{validadeProposta}</Text>
                  </View>
                )}
                {validadeSetup && (
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 9, color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Validade do Bônus de Setup</Text>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#0f172a', marginTop: 4 }}>{validadeSetup}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        {!skipDiagnostic && (
          <View style={{ backgroundColor: '#ecfdf5', borderWidth: 1, borderColor: '#a7f3d0', padding: 20, borderRadius: 8, alignItems: 'center', marginTop: 20 }}>
            <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#065f46', textTransform: 'uppercase' }}>Previsão de Payback</Text>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#059669', marginVertical: 10 }}>
              {roi.paybackDias > 0 ? `${Math.ceil(roi.paybackDias)} Dias` : 'Imediato'}
            </Text>
            <Text style={{ fontSize: 10, color: '#047857' }}>O sistema se paga rapidamente eliminando o desperdício diário mapeado.</Text>
          </View>
        )}
        <View style={{ alignItems: 'center', marginTop: 30, marginBottom: 10 }}>
          <Link src="https://www.valitag.com.br/onboarding" style={[styles.btnSuccess, { paddingHorizontal: 40, paddingVertical: 15, fontSize: 16, backgroundColor: '#0ea5e9', width: '80%' }]}>
            Clique aqui e faça seu cadastro
          </Link>
        </View>
        
      <View style={{ marginVertical: 30, borderBottomWidth: 2, borderBottomColor: '#e2e8f0' }} />

      {/* HARDWARE */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Equipamentos e Insumos</Text>
            <Text style={styles.headerSubtitle}>Hardware certificado para máxima performance.</Text>
          </View>
          <Image src={logoUrl} style={styles.logoMini} />
        </View>

        <Text style={[styles.sectionTitle, { borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingBottom: 5, marginBottom: 15 }]}>Impressoras Compatíveis</Text>
        <View style={styles.hardwareGrid}>
          {(hardwareConfig?.impressoras || []).slice(0, 4).map((imp, idx) => (
            <View key={idx} style={styles.printerCard} wrap={false}>
              {(() => {
                const url = imp.imageUrl?.trim() || '';
                const isValid = url.startsWith('http') || url.startsWith('data:');
                const finalSrc = isValid ? url : LOCAL_PRINTER_IMAGES[idx];
                return finalSrc ? <Image src={finalSrc} style={styles.printerImage} /> : null;
              })()}
              <Text style={[styles.textBold, { marginBottom: 5 }]}>{imp.nome || `Impressora ${idx + 1}`}</Text>
              {(imp.beneficios || '').split('\n').filter(b => b.trim() !== '').slice(0, 3).map((b, i) => (
                <Text key={i} style={{ fontSize: 9, color: '#475569', marginBottom: 2 }}>• {b}</Text>
              ))}
              {imp.linkCompra && (
                <Link src={imp.linkCompra} style={styles.btnLink}>Comprar no Mercado Livre</Link>
              )}
            </View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingBottom: 5, marginVertical: 15 }]}>Etiquetas Homologadas</Text>
        <View style={styles.hardwareGrid}>
          {(hardwareConfig?.etiquetas || []).slice(0, 3).map((etiq, idx) => (
            <View key={idx} style={[styles.printerCard, { width: '31%', alignItems: 'center' }]} wrap={false}>
              {etiq.imageUrl && <Image src={etiq.imageUrl} style={{ height: 50, objectFit: 'contain', marginBottom: 5 }} />}
              <Text style={[styles.textBold, { fontSize: 10, marginBottom: 5, textAlign: 'center' }]}>{etiq.tamanho}</Text>
              {etiq.linkCompra && (
                <Link src={etiq.linkCompra} style={[styles.btnLink, { backgroundColor: '#1e293b', width: '100%' }]}>Comprar</Link>
              )}
            </View>
          ))}
        </View>
      <View style={{ marginVertical: 30, borderBottomWidth: 2, borderBottomColor: '#e2e8f0' }} />

      {/* PLANO DE IMPLEMENTAÇÃO E LINKS */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Plano de Implementação</Text>
            <Text style={styles.headerSubtitle}>Próximos passos para o Go-Live.</Text>
          </View>
          <Image src={logoUrl} style={styles.logoMini} />
        </View>

        <View style={styles.stepRow}>
          <View style={styles.stepIcon}><Text style={styles.stepIconText}>D1</Text></View>
          <View style={styles.stepContent}>
            <Text style={styles.textBold}>Setup e Integração</Text>
            <Text style={[styles.textSmall, { marginTop: 4 }]}>Configuração da base de dados e cadastro de usuários.</Text>
          </View>
        </View>
        <View style={styles.stepRow}>
          <View style={styles.stepIcon}><Text style={styles.stepIconText}>D2</Text></View>
          <View style={styles.stepContent}>
            <Text style={styles.textBold}>Entrega Tecnológica</Text>
            <Text style={[styles.textSmall, { marginTop: 4 }]}>Envio e configuração de coletores e impressoras.</Text>
          </View>
        </View>
        <View style={styles.stepRow}>
          <View style={styles.stepIcon}><Text style={styles.stepIconText}>D3</Text></View>
          <View style={styles.stepContent}>
            <Text style={styles.textBold}>Treinamento Prático</Text>
            <Text style={[styles.textSmall, { marginTop: 4 }]}>Acompanhamento com a equipe para engajamento.</Text>
          </View>
        </View>
        <View style={styles.stepRow}>
          <View style={[styles.stepIcon, { backgroundColor: primaryColor }]}><Text style={[styles.stepIconText, { color: '#fff' }]}>D7</Text></View>
          <View style={styles.stepContent}>
            <Text style={styles.textBold}>Go-Live Operacional</Text>
            <Text style={[styles.textSmall, { marginTop: 4 }]}>Sistema 100% rodando e primeira auditoria concluída.</Text>
          </View>
        </View>

        <View style={{ marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#e2e8f0', alignItems: 'center' }}>
          <Text style={styles.sectionTitle}>Links Importantes</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 10 }}>
            {linksConfig?.site && <Link src={linksConfig.site} style={styles.footerLink}>Site Oficial</Link>}
            {linksConfig?.impressoras && <Link src={linksConfig.impressoras} style={styles.footerLink}>Impressoras Recomendadas</Link>}
            {linksConfig?.etiquetas && <Link src={linksConfig.etiquetas} style={styles.footerLink}>Compra de Etiquetas</Link>}
            {linksConfig?.customLinks?.map(link => (
              <Link key={link.id} src={link.url} style={styles.footerLink}>{link.name}</Link>
            ))}
          </View>

          <Link src="https://www.valitag.com.br/onboarding" style={[styles.btnSuccess, { paddingHorizontal: 30, paddingVertical: 12, backgroundColor: '#0ea5e9' }]}>
            Clique aqui e faça seu cadastro
          </Link>
        </View>

        {(!skipDiagnostic && (planoId === 'starter' || planoId === 'pro')) && (
          <View style={styles.crossSellBox}>
            <Text style={styles.crossSellTitle}>Potencial de Evolução da Operação</Text>
            <Text style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', marginBottom: 15 }}>
              Nosso diagnóstico identificou uma oportunidade real de estancar perdas severas.
            </Text>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#f87171' }}>
              Perda Mapeada: -{formatMoney(roi.diagnosticoCompleto?.totalPerdaAnual || 0)}/ano
            </Text>
            <Text style={{ fontSize: 10, color: '#cbd5e1', marginTop: 10 }}>Conheça nossos planos avançados para atingir este nível de economia.</Text>
          </View>
        )}

        {/* LISTA DE PLANOS DISPONÍVEIS */}
        <View style={{ marginTop: 40, paddingTop: 20, borderTopWidth: 2, borderTopColor: '#e2e8f0' }}>
          <Text style={[styles.sectionTitle, { textAlign: 'center', marginBottom: 20 }]}>Nossos Planos</Text>
          
          {Object.values(pricingConfig?.planos || {})
            .filter(p => p.visible !== false)
            .sort((a, b) => (a.ordem || 0) - (b.ordem || 0))
            .map((p, index) => (
            <View key={index} style={{ marginBottom: 15, padding: 15, backgroundColor: '#f8fafc', borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1' }} wrap={false}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#0f172a', textTransform: 'uppercase' }}>{p.nome}</Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#0084d1' }}>{formatMoney(p.preco)}<Text style={{ fontSize: 10, color: '#64748b' }}>/mês</Text></Text>
              </View>
              <Text style={{ fontSize: 10, color: '#475569', marginBottom: 10, lineHeight: 1.4 }}>{p.description}</Text>
              
              {p.features && p.features.length > 0 && (
                <View style={{ marginTop: 5 }}>
                  <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#64748b', marginBottom: 5, textTransform: 'uppercase' }}>Incluso:</Text>
                  {p.features.map((feat, i) => (
                    <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 3 }}>
                      <Text style={{ fontSize: 10, color: '#0ea5e9', marginRight: 5 }}>•</Text>
                      <Text style={{ fontSize: 9, color: '#334155' }}>{feat}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
